# Personal Gemini Chatbot

## Requirements

- Git and a GitHub account
  - Check Git version: ` git --version `
- Node version 20 or above
  - Check Node version: ` node --version `
- An editor, such as VS Code
  - Check VS Code version: ` code --version `

## Creation steps

- Open VS Code to Project directory
- Open the Terminal
- Create and move into ` /gemini-chat/ ` directory ` mkdir gemini-chat ` then ` cd gemini-chat `
- Initialize project ` npm init `, answer questions, update info as needed
- Install packages
  - ` npm install @google/generative-ai `
  - ` npm install dotenv `
  - ` npm install readline `
- Create gitignore: ` code .gitignore `, add ` node_modules ` as first line and save
- Right click Explorer sidebar area, and select ` Generate .editorconfig ` and save
  - Optionally change indent_size = 4 to indent_size = 2 and save
- Create readme: ` code README.md `, update to current point, and save
- Initialize Git repo: ` git init `
  - Create a repository at GitHub
    - Repositories tab
    - New button
    - Repository name: ` gemini-chat `
    - Description: ` A Personal Gemini Chatbot `
    - Select: ` Private `
    - Click the ` Create repository ` button
  - Add repository url to local project
    - Example using HTTPS: ` git remote add origin https://github.com/OWNER/gemini-chat.git `
    - Example using SSH: ` git remote add origin git@github.com:OWNER/gemini-chat.git `
  - Stage all files: ` git add -A `
  - Add a commit message: ` git commit -m "Init commit" `
  - Push changes to GitHub: ` git push origin main `
- 