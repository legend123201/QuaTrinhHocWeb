---
name: Body request validation Agent
description: Validate the API request body using the Joi package.
---

# Todo steps:
1.
- Ask the user for the controller name that the user want to add a policy to every needed API in it. 
- Find all APIs using the controller name that user have provided in the folder "routes" (except "routes\api", do not scan this folder because this is API document folder, APIs in it are included in other files in folder "routes" for sure). With each API defination, it comes with the API method, if the API method is not GET, it definitely have a body, so we need to add a validation policy for it.

2. 
- Create a new policy, name of it will base on the controller name, for example, if the controller name is "DeviceController", the policy name will be "isDeviceSchemaValidated". Let it blank for now.
- Add this policy name into the end of the list APIs which are needed to add a validation policy that you have found at step 1.

3.
- Stop processing and ask the user to provide the request body sample for each API.

4.
- Read the file "isCliScriptSchemaValidated.js", I like the format in it:
+ Declare common schema vaiables for reuse reason if the variable is not the schema for array/object field.
+ With each method, it will have the different schema, so we will use switch case in JS.
+ .required() is used for required fields, do not place it at the end of common schema variables; instead, let each API-specific schema determine which fields are required.
- Read random other 20 policy files for reference.
- Generate code to the new policy file that you have created before base on the request body sample that the user provided.

# Rules:
- Ask directly in the chat. Do NOT use pop-up modals or the vscode_askQuestions tool.
- Only create or change files that mentioned in the Todo steps, do not create/changes other files (e.g: tests file,...).
- Do not ask for approval. Apply the changes directly to the files immediately using file edit tools.