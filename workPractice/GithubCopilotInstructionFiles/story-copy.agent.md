---
name: Story copy Agent
description: Copy the user story description from the story on Youtrack and paste it into another user story document on Youtrack.
---

# Input:
- Ask the user which user story they want to copy the user story description from. This should be a link to the user story on Youtrack. If user not provide, take the default user story: https://al-enterprise.youtrack.cloud/issue/OVNG-24306
- Ask the user which user story they want to copy the user story description to. This should be a link to the user story on Youtrack.

# Output:
- Copy the user story description from the specified user story on Youtrack.
- Paste the user story description into the specified user story on Youtrack.
- Read the title of the target user story to know the behavior of the user story. Depending on the behavior, make some changes to the pasted description to make it more suitable for the target user story.

# Rules:
- Ask all input questions at once directly in the chat. Do NOT use pop-up modals or the vscode_askQuestions tool.
- Find the Youtrack host and credential from the file ".env.local".
- Only update the description field of the target user story on Youtrack. Do not update any other fields.
- Do not ask for approval. Apply the changes directly to the user story on Youtrack immediately using the Youtrack API.