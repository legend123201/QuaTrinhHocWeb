---
name: debug-email-delivery-failures
description: "Use when: debugging email delivery failures, SMTP transport errors, missing locale keys in email templates, wrong-language emails, branding not applied, missing header/logo customization, MailDev issues, or queue-to-template-to-transport failures in this Sails.js backend. Covers QueueService, NotificationService, EmailHtmlTemplateService, EJS email templates, locale strings, bootstrap email transport config, and optional Kubernetes cluster log collection from the shared ovng Helm chart."
argument-hint: "Provide the symptom, template name if known, recipient email, approximate send time, orgId if branding is expected, and optionally namespace/cluster info for live log checks."
---

# Debug Email Delivery Failures

Use this skill to debug the full email path in this repository:

- trigger point in controller or service
- queue preparation in `api/services/QueueService.js`
- rendering in `api/services/NotificationService.js`
- translation via `config/locales/*.json`
- organization branding via `api/services/EmailHtmlTemplateService.js`
- SMTP transport setup from `config/bootstrap.js` and Helm env values
- optional live cluster evidence using the shared chart under `C:/Thuan/ov/shared/charts/ovng`

This skill is specific to this repository and its deployment model.

## When To Use

- Email is not delivered at all.
- Delivery works locally but fails in cluster.
- Queue function runs but no email arrives.
- Wrong language is used in the email body or subject.
- EJS rendering fails or partials are missing expected values.
- Organization branding is not applied even though `orgId` is expected.
- Header or logo customization does not appear in the rendered email.
- DB-backed template sends differently from EJS template sends.
- MailDev receives nothing or backend transport appears misconfigured.

## Outcomes

This skill should produce:

- the failing stage of the pipeline
- the most likely root cause
- the exact repo files to inspect or edit
- concrete validation steps
- optional `kubectl` commands to collect runtime evidence from the cluster

## Required Inputs

Provide as many of these as possible:

- symptom description
- recipient email
- template name if known
- route/controller/service that should have triggered the email
- approximate send time and timezone
- `orgId` if organization branding is expected
- preferred language or the language actually observed
- environment name or cluster base URL
- Kubernetes namespace if cluster logs are needed

If cluster data is missing, ask for:

- namespace
- environment name
- whether the environment uses MailDev or a real SMTP relay
- one failing recipient and one approximate timestamp

## Repository-Specific Architecture

### Main path

1. Business flow calls a queue entry in `api/services/QueueService.js`.
2. `QueueService` builds `emailParams`.
3. Some queue functions call `sails.hooks.i18n.setLocale(...)` before sending.
4. `NotificationService.sendEmail(emailParams)` creates a Nodemailer transport from `sails.config.globals.transportParams`.
5. `NotificationService` loads `views/emails/<template>/html.ejs` through `email-templates`.
6. If `emailParams.params.orgId` is present, `EmailHtmlTemplateService.getEmailHtmlTemplate(orgId)` overlays organization branding and localized footer/signature text.
7. Common partials under `views/emails/common/` consume `subject`, `template.*`, and `ovName`.
8. Nodemailer sends the message.

### Alternate path

`NotificationService.sendEmailUsingDBTemplate(emailParams)` bypasses EJS and sends HTML from the `EmailTemplate` model using `{{key}}` replacement.

Use this branch only when the failing code calls `sendEmailUsingDBTemplate`.

## Decision Tree

### Branch A. No email sent at all

Start with transport or queue diagnosis.

Signals:
- no message in MailDev or mailbox
- no SMTP logs
- no `NotificationService.sendEmail(...)` side effects
- queue callback may not be reached

### Branch B. Email sent but wrong language

Start with locale and template-key diagnosis.

Signals:
- English content appears for a French user
- untranslated key-like strings appear
- one part of the email is localized but footer/signature is not

### Branch C. Email sent but branding not applied

Start with `orgId` and `EmailHtmlTemplateService` diagnosis.

Signals:
- default header/logo appears instead of org custom assets
- footer/signature uses default text instead of organization overrides
- wrong image URLs are rendered

### Branch D. Rendering fails or email content is malformed

Start with EJS template and locals diagnosis.

Signals:
- missing button URL
- blank subject in header partial
- EJS exception in backend logs
- broken HTML or missing partial content

## Procedure

### Step 1. Resolve the exact trigger path

Start from the strongest anchor available:

- queue function name
- email template folder name
- controller action
- log line
- failing behavior

Trace only the local path needed:

1. find the queue entry in `api/services/QueueService.js`
2. identify the template name in `emailParams.template`
3. identify whether `sendEmail(...)` or `sendEmailUsingDBTemplate(...)` is used
4. identify whether `orgId` is passed in `emailParams.params`
5. identify whether locale is explicitly set before the send

Cheap discriminators:

- if no queue function is reached, the failure is upstream of email delivery
- if queue function builds `emailParams` but no locale is set, wrong-language issues are likely explained locally
- if `orgId` is absent, branding-not-applied is expected behavior, not a rendering bug

### Step 2. Classify the failing stage

Use this table:

| Symptom | Most likely stage |
|---|---|
| No email in MailDev or SMTP logs | transport or queue |
| Email exists but wrong subject/body language | locale setup or missing locale keys |
| Default header/logo appears | branding path not engaged or custom template missing |
| Footer/signature text wrong but body is translated | `EmailHtmlTemplateService` / `defaultEmailTemplate` mismatch |
| Template crashes or button missing | EJS locals or template body bug |
| Only DB template path fails | `EmailTemplate` data or `{{key}}` replacement bug |

### Step 3. Debug transport and queue failures

Inspect in this order:

1. `api/services/QueueService.js`
2. `api/services/NotificationService.js`
3. `config/bootstrap.js`
4. `config/env/*.js`
5. Helm chart templates under `C:/Thuan/ov/shared/charts/ovng/templates/`

Repository-specific facts to verify:

- backend deployment is `ovng-backend`
- backend pod label is `app=ovng-backend`
- MailDev deployment and service are `ovng-maildev`
- SMTP env vars are populated through config map `ovng-backend`
- backend transport uses env values like `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_FROM`, `EMAIL_IGNORE_TLS`, `EMAIL_AUTHENTICATION`, `EMAIL_SECURE`, `EMAIL_TLS_REJECT_UNAUTHORIZED`, `EMAIL_TLS_IS_CA_USED`
- CA certificate secret is `ca-email` when TLS CA is enabled

Checkpoints:

- Does the business flow actually call the queue function?
- Does the queue callback call `NotificationService.sendEmail(...)`?
- Does `NotificationService` build the transport from `sails.config.globals.transportParams`?
- Was `transportParams` initialized during bootstrap?
- Are SMTP env vars present in the backend pod?
- Is MailDev enabled in the environment, or is the backend pointing to a real SMTP server?

Useful cluster commands:

```powershell
kubectl -n <namespace> get deploy ovng-backend ovng-maildev
kubectl -n <namespace> get pods -l app=ovng-backend -o wide
kubectl -n <namespace> get pods -l app=ovng-maildev -o wide
kubectl -n <namespace> logs deploy/ovng-backend --since=30m
kubectl -n <namespace> logs deploy/ovng-backend --since=30m | Select-String -Pattern "QueueService|NotificationService|email|smtp|nodemailer|transport|failed|error"
kubectl -n <namespace> exec deploy/ovng-backend -- printenv | Select-String -Pattern "^EMAIL_|^ADMIN_EMAIL_ERROR|^LOG_LEVEL"
kubectl -n <namespace> get configmap ovng-backend -o yaml
kubectl -n <namespace> get secret ca-email -o yaml
kubectl -n <namespace> logs deploy/ovng-maildev --since=30m
kubectl -n <namespace> port-forward svc/ovng-maildev 8084:8084
```

What those commands prove:

- backend and MailDev are actually deployed
- SMTP env config in cluster matches expectations
- backend logs show whether queue and send paths executed
- MailDev logs and UI show whether SMTP delivery reached the sink

### Step 4. Debug missing locale keys or wrong-language emails

Inspect in this order:

1. queue function in `api/services/QueueService.js`
2. `config/locales/en.json` and target language file
3. `views/emails/<template>/html.ejs`
4. `api/constants/defaultEmailTemplate.js`
5. `api/services/EmailHtmlTemplateService.js`

Repository-specific rules:

- body-specific strings are often rendered with `sails.__("key")` inside EJS
- footer/signature strings come from `defaultEmailTemplate` or `EmailHtmlTemplate`, not directly from `sails.__()` in every template
- several queue methods explicitly set locale using `user.preferredLanguage || "en"`
- some queue methods do not set locale, so they rely on the current context/default

Checkpoints:

- Is `sails.hooks.i18n.setLocale(...)` called before the send?
- Is the intended key present in `config/locales/en.json` and the target locale file?
- Is the wrong text from EJS `sails.__()` usage or from the `template` object merged by `EmailHtmlTemplateService`?
- Does `defaultEmailTemplate` include the language and key used by the footer/signature?

Typical defects:

- locale set too late or not at all
- key exists in `en.json` but not in another language file
- body text translated correctly but footer/signature stays default because only locale files were updated, not `defaultEmailTemplate`
- queue function forces English for a flow by design

### Step 5. Debug branding not applied

Inspect in this order:

1. queue function building `emailParams`
2. `NotificationService.sendEmail(...)`
3. `EmailHtmlTemplateService.getEmailHtmlTemplate(...)`
4. `EmailHtmlTemplate` model data
5. frontend organization page and store actions if user reports save/deploy issues

Critical repository rule:

`NotificationService.sendEmail(...)` only resolves organization branding when `emailParams.params.orgId` is present.

Checkpoints:

- Does `emailParams.params` include `orgId`?
- Is the email flow MSP-level or system-level, where `orgId` may legitimately be absent?
- Does an `EmailHtmlTemplate` document exist for the target organization?
- Are `img.header` and `img.logo` populated?
- Did `EmailHtmlTemplateService` expand relative paths to full backend URLs?
- Did the org customization UI save images/text successfully?
- Did sync to UPAM and Reporting microservices succeed after customization?

Frontend pieces for customization:

- `C:/Thuan/ov/frontend/src/components/organization/customizeEmailTemplate.vue`
- `C:/Thuan/ov/frontend/src/store/modules/customEmailTemplate.js`

Branding-specific failure patterns:

- missing `orgId` in queue params means default branding is expected
- custom text updated in UI but backend still returns defaults means save/reset path or model data issue
- new header/logo not shown means image upload or URL resolution issue
- backend email shows correct branding but a downstream microservice email does not means sync failure in `updateMSEmailTemplate(...)`

### Step 6. Debug EJS rendering and locals issues

Inspect:

- `views/emails/<template>/html.ejs`
- `views/emails/common/header.ejs`
- `views/emails/common/signature.ejs`
- `views/emails/common/socialnetworks.ejs`
- `views/emails/common/footer.ejs`

Repository-specific expectations:

- top-level `emailParams.subject` is used for the actual mail header
- `params.subject` must also be present because common partials read it from locals
- `template` local must contain `header_mail_img`, `logoALE_img`, and footer/signature strings
- `ovName` is passed separately by `NotificationService`

Checkpoints:

- Does the queue function include `params.subject`?
- Are template-specific locals like `verifyUrl`, `firstname`, `inviteeName`, `organizationName`, or `requesterFullname` populated?
- Are EJS includes pointing to the correct relative partial paths?
- Does the template use `sails.__()` with keys that exist?

### Step 7. Debug DB-backed template failures

Use this branch only when the flow uses `NotificationService.sendEmailUsingDBTemplate(...)`.

Inspect:

- `api/services/NotificationService.js`
- `api/services/EmailTemplateService.js`
- `api/models/EmailTemplate.js`

Checkpoints:

- Does the `EmailTemplate` record exist for `templateName`?
- Does `templateContent` use `{{key}}` placeholders that match `emailParams.params` exactly?
- Is `templateSubject` present?
- Is the caller expecting EJS partial behavior even though DB templates do not include that mechanism?

## Cluster Information To Ask For

If live debugging is needed, ask for:

- namespace
- environment name or cluster URL
- whether MailDev is enabled there
- one failing recipient
- approximate send timestamp with timezone
- expected template name if known
- expected organization ID for branding

If the user does not know how to get pod names or logs, show these commands:

```powershell
kubectl get ns
kubectl -n <namespace> get deploy
kubectl -n <namespace> get pods -l app=ovng-backend
kubectl -n <namespace> get pods -l app=ovng-maildev
kubectl -n <namespace> logs deploy/ovng-backend --since=1h
kubectl -n <namespace> logs deploy/ovng-maildev --since=1h
kubectl -n <namespace> get configmap ovng-backend -o yaml
kubectl -n <namespace> exec deploy/ovng-backend -- printenv
kubectl -n <namespace> port-forward svc/ovng-maildev 8084:8084
```

## Findings Format

Report findings in this order:

1. failing stage
2. evidence
3. root cause hypothesis
4. exact file or config involved
5. next validation step or fix

Good examples:

- Queue function never sets locale, so `sails.__()` resolves English by default.
- `orgId` is missing from `emailParams.params`, so org branding is never loaded.
- Backend pod is configured with `EMAIL_HOST=ovng-maildev` but MailDev deployment is absent in namespace.
- EJS template uses `sails.__("my_new_key")` but the key is missing in `fr.json`.
- DB template content uses `{{userName}}` but caller sends `firstname`.

## Completion Checks

- The failing stage is identified as queue, locale, branding, rendering, DB template, or transport.
- The exact repo files for that stage were inspected.
- For branding issues, presence or absence of `orgId` was explicitly verified.
- For locale issues, both the queue locale setup and locale key existence were checked.
- For cluster transport issues, backend deployment config and runtime logs were checked or concrete `kubectl` commands were provided.
- The result distinguishes EJS-template failures from DB-template failures.

## Example Prompts

- Debug why invitation emails are not delivered on the dev cluster. Namespace is `ovng-dev`, recipient is `user@example.com`, around 14:30 UTC.
- Investigate why password-reset emails are always in English even for French users.
- Check why organization email branding is not applied for org `65abc...` even though the UI customization page saved successfully.
- Trace this failing email from `QueueService` to `NotificationService` and tell me whether the problem is queue, locale, branding, or SMTP.
- Help me collect the right `kubectl` commands to debug backend email transport in the cluster.
