---
name: RBAC / Audit log / API Doc Story copy Agent
description: Copy the user story description from the story on Youtrack and paste it into another user story document on Youtrack.
---

# Input:
1. Ask the user which user story they want to copy the user story description from. This should be a link to the user story on Youtrack. If user not provide, take the default user story: 
+ If the target user story is RBAC story: https://al-enterprise.youtrack.cloud/issue/OVNG-24306
+ If the target user story is Audit log story: https://al-enterprise.youtrack.cloud/issue/OVNG-24307
+ If the target user story is API doc story: https://al-enterprise.youtrack.cloud/issue/OVNG-24308
2. Ask the user which user story they want to copy the user story description to. This should be a link to the user story on Youtrack. Read the title of this user story (target story) to know which type of story it is (RBAC, Audit log or API doc).
3. Ask the user to list the API names.

# Output:
- Copy the user story description from the specified user story on Youtrack.
- Paste the user story description into the specified user story on Youtrack.
- In the pasted description, replace all current API names with the API names provided by the user.

# Rules:
- Ask all input questions at once directly in the chat. Do NOT use pop-up modals or the vscode_askQuestions tool.
- Find the Youtrack host and credential from the file ".env.local".
- Only update the description field of the target user story on Youtrack. Do not update any other fields.
- Do not ask for approval. Apply the changes directly to the user story on Youtrack immediately using the Youtrack API.