---
name: "OVNG API Migration Guideline"
description: "Generate old-to-new OVNG API migration guideline packages from source and target branches using regenerated swagger and oasdiff"
argument-hint: "Story context, source ref, target ref, output folder, and any customer-specific scope"
agent: "agent"
---

# OVNG API Migration Guideline Prompt

Generate a human-readable, Markdown-only migration package for OVNG API changes between an old source version and a newer target version.

Default assumptions unless the user overrides them:
- Source ref: `/v10.5.2GA`
- Target ref: `master`
- Workspace root: current backend repository
- Delivery artifacts: one Cirrus Markdown file and one Terra Markdown file

## Objective

Produce concise customer-facing migration guidance that a consuming developer or partner integrator can use directly to update application code without reverse-engineering API differences manually.

The output must be human-readable first, Markdown-only, and limited to contract deltas, their impact, and concrete migration actions. Do not include internal workflow notes, generation steps, appendix dumps, or Copilot meta-guidance unless the user explicitly asks for them.

## Required Inputs

Ask for any missing input before making edits or running commands:
- The exact source ref if it differs from `/v10.5.2GA`
- The exact target ref if it differs from `master`
- The user story or business context to include in the introduction
- Confirmation that `apidoc/swagger/swagger-v2.json` exists or the file itself if it is missing
- Confirmation that `oasdiff.exe` has already been downloaded by the user and placed in the backend repo root
- Preferred output folder if the user does not want the Markdown artifacts in the repo root

If `oasdiff.exe` is missing, stop and ask the user to place it in the backend root before continuing.

## Workflow

Follow this workflow in order. Do not skip the swagger-generator replacement step.

1. Validate prerequisites.
- Confirm `apidoc/swagger/swagger-v2.json` is available.
- Confirm `oasdiff.exe` is present in the backend root.
- Confirm the fixed local swagger hook exists at [scripts/sails-hook-swagger-generator](../../scripts/sails-hook-swagger-generator).

2. Preserve the fixed swagger hook before changing branches.
- Copy the full folder [scripts/sails-hook-swagger-generator](../../scripts/sails-hook-swagger-generator) to a safe temporary location outside the backend repo.
- Use that preserved copy as the known-good generator containing the `required` normalization fix.

3. Generate the old-version swagger from the source ref.
- Check out or clone the source ref.
- Replace the source branch version of [scripts/sails-hook-swagger-generator](../../scripts/sails-hook-swagger-generator) with the preserved fixed copy.
- Ensure `apidoc/swagger/swagger-v2.json` is present for that source checkout as well.
- Run `npm run apidoc`.
- Confirm the generated outputs include Cirrus and Terra swagger JSON files.
- Copy the resulting old-version Cirrus and Terra swagger files to a safe location outside the backend repo.

4. Generate the new-version swagger from the target ref.
- Switch to the target ref, default `master`.
- Ensure the fixed [scripts/sails-hook-swagger-generator](../../scripts/sails-hook-swagger-generator) is still present.
- Ensure `apidoc/swagger/swagger-v2.json` is present.
- Run `npm run apidoc`.
- Confirm the generated outputs include Cirrus and Terra swagger JSON files.

5. Run diff analysis with `oasdiff.exe`.
- Compare old Cirrus swagger against new Cirrus swagger.
- Compare old Terra swagger against new Terra swagger.
- Capture the terminal output for each comparison.

6. Turn the raw diff output into delivery-ready Markdown.
- Create one Markdown package per requested product flavor.
- By default, create one Markdown package for Cirrus and one for Terra when both diffs are available.
- Keep each file Markdown-only.
- Preserve the important terminal findings, but rewrite them into a developer-facing migration guide rather than pasting an unreadable raw dump.

## Mandatory Delta Categories

For every relevant API change, organize the migration guidance using these categories:
- Endpoint additions and removals
- Path and method changes
- Authentication and header changes
- Query parameter changes
- Request field additions, removals, renames, type changes, and required-flag changes
- Response field additions, removals, renames, and type changes
- Status-code and error-body changes
- Behavior changes not visible from schema alone

If a category has no changes, explicitly state that no changes were detected.

## Required Output Structure

Create one primary Markdown file per requested product flavor:
- `migration-guideline-cirrus.md`
- `migration-guideline-terra.md`

Each file must follow this exact concise structure unless the user explicitly requests more detail:

1. Title
- Include product flavor, source version, target version, and generation date.

2. Purpose
- One short paragraph describing who should use the guide and what problem it solves.

3. API Delta Sections
- Organize findings by endpoint or endpoint group.
- For each changed API or API group, include:
	- an `Affected endpoints` list
	- a Markdown table with these columns only: `Delta category`, `Detected change`, `Impact`, `Migration action`
- Use the mandatory delta categories listed above.

4. Migration Recommendations
- Provide only concrete consumer actions derived from the confirmed diff output.

Do not include these sections unless the user explicitly asks for them:
- Scope And Inputs
- Executive Summary
- Copilot-Ready Migration Prompt
- Behavioral Notes
- Development-Team Responsibility
- Raw Diff Appendix

## Quality Rules

- Human-readable first.
- Markdown-only.
- Customer-facing and concise.
- Do not invent behavior changes that were not verified.
- Prefer explicit "unknown" over speculation when the impact cannot be proven from the diff.
- Keep terminology consistent between Cirrus and Terra documents.
- Call out breaking changes clearly.
- When a rename is inferred rather than proven, label it as a likely rename instead of a confirmed rename.
- Do not expose internal tooling workflow or branch-management steps in the final customer document.

## Execution Notes

- Use the fixed local swagger hook, not the stale branch copy, when generating source-version swagger.
- Do not continue if `swagger-v2.json` is unavailable; ask the user for it.
- Do not attempt to download `oasdiff.exe` yourself. The user must place it in the repo first.
- Save the final Markdown delivery packages in the user-requested location, or the repo root if none was specified.

## Final Response

When the work is complete:
- State which Markdown files were written.
- State which versions or refs were compared.
- Mention any blockers, assumptions, or unknown behavior gaps.