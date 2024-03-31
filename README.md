# Personal Gemini Chatbot

Interact with Google's Gemini AI.

## Based on

- [Get started with the Gemini API in Node.js applications](https://ai.google.dev/tutorials/get_started_node)
- [Master the Gemini API: A Node.js tutorial with real examples](https://www.youtube.com/watch?v=Z8F6FvMrN4o)

## Setup

Locally setup Personal Gemini Chatbot to get started.

### Requirements

- [API Key](https://aistudio.google.com/app/apikey) from Google AI Studio
- [Node.js](https://nodejs.org/en/download) version 20 and above
- [Git](https://git-scm.com/downloads) * Optional but recommended
  - Check Git version: ` git --version `

### Install

1. Open a terminal
   - **Windows**: Right-click the Start button and select: ` Windows PowerShell `
   - **Mac**: Command + Space to open Spotlight search, type in ` Terminal ` and select
   - **Linux**: Press CTRL + ALT + T simultaneously
2. In the terminal change locations to store this project, such as ` cd ~/Documents `
   - Optionally create a Projects directory instead of using the Documents directory
     - Make the Projects directory: ` mkdir ~/Projects `
     - Change directories into Projects: ` cd ~/Projects `
3. 2 methods to setup the project
   - Method 1: Clone the project into the current directory
     - Via HTTPS: ` git clone https://github.com/ChrisWinters/gemini-chat.git `
     - Via SSH: ` git clone git@github.com:ChrisWinters/gemini-chat.git `
     - Via CLI: ` gh repo clone ChrisWinters/gemini-chat `
   - Method 2: Use curl to quickly download the project zip file into the current directory
     - **Windows** terminal: ` curl `, copy/paste the pre-packaged zip file url ` https://github.com/ChrisWinters/gemini-chat/raw/master/gemini-chat.zip `
     - **Mac/Linux** terminal: ` curl -L -O https://github.com/ChrisWinters/gemini-chat/raw/master/gemini-chat.zip `
     - Unzip the gemini-chat.zip file
       - **Windows**: ` tar -xf gemini-chat.zip `
       - **Mac**: ` tar -xvf gemini-chat.zip `
       - **Linux**: ` tar -xzf gemini-chat.zip `
     - Delete the zip file: ` rm gemini-chat.zip `
4. Change directories into the Gemini chat directory: ` cd gemini-chat `
5. Install build packages: ` npm install `
6. Run project: ` npm run chat `
