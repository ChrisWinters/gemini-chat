# Personal Gemini Chatbot

Use the terminal to interact with Google's Gemini AI.

## Based on

- [Get started with the Gemini API in Node.js applications](https://ai.google.dev/tutorials/get_started_node){:target="_blank"}
- [Master the Gemini API: A Node.js tutorial with real examples](https://www.youtube.com/watch?v=Z8F6FvMrN4o){:target="_blank"}

## Setup

Locally setup the Personal Gemini Chatbot project to get started.

### Requirements

- [API Key](https://aistudio.google.com/app/apikey){:target="_blank"} from Google AI Studio
- [Node.js](https://nodejs.org/en/download){:target="_blank"} version 20 and above
  - Check Node.js version: ` node --version `
- [Git](https://git-scm.com/downloads){:target="_blank"} * Optional but recommended
  - Check Git version: ` git --version `

### Install project

1. Get an [API Key](https://aistudio.google.com/app/apikey){:target="_blank"} from Google AI Studio
2. Open a terminal
   - **Windows**: Right-click the Start button and select: ` Windows PowerShell `
   - **Mac**: Command + Space to open Spotlight search, type in ` Terminal ` and select
   - **Linux**: Press CTRL + ALT + T simultaneously
3. In the terminal change locations to store this project, such as ` cd ~/Documents `
   - Optionally create a Projects directory instead of using the Documents directory
     - Make the Projects directory: ` mkdir ~/Projects `
     - Change directories into Projects: ` cd ~/Projects `
4. 2 methods to setup the project
   - **Method 1 (with Git)**: Clone the project into the current directory
     - Via **HTTPS**: ` git clone https://github.com/ChrisWinters/gemini-chat.git `
     - Via **SSH**: ` git clone git@github.com:ChrisWinters/gemini-chat.git `
     - Via **CLI**: ` gh repo clone ChrisWinters/gemini-chat `
   - **Method 2 (without Git)**: Use curl to quickly download the pre-packaged zip file into the current directory
     - **Windows** terminal type: ` curl `, press enter, then copy/paste the following Uri: ` https://github.com/ChrisWinters/gemini-chat/raw/main/gemini-chat.zip `
     - **Mac/Linux** terminal: ` curl -L -O https://github.com/ChrisWinters/gemini-chat/raw/main/gemini-chat.zip `
     - Unzip the gemini-chat.zip file
       - **Windows** terminal: ` tar -xf gemini-chat.zip `
       - **Mac** terminal: ` tar -xvf gemini-chat.zip `
       - **Linux** terminal: ` tar -xzf gemini-chat.zip `
     - Delete the zip file: ` rm gemini-chat.zip `
5. Change directories into the Gemini chat directory: ` cd gemini-chat `
6. Install build packages: ` npm install `
7. Run test prompt: ` npm run test ` (API Key required)
8. Run chat prompt: ` npm run chat ` (API Key required)

*NOTICE*: Do not share confidential or personal information with Gemini AI.

## Build commands

Command              | Script                       | Description
---                  | ---                          | ---
``` npm install ```  |                              | Install dependencies
``` npm run test ``` | ``` node index.js --test ``` | Runs test prompt
``` npm run chat ``` | ``` node index.js --live ``` | Runs interactive chat prompt
``` npm run zip ```  | ``` node index.js --zip ```  | Creates gemini-chat.zip

## Disclaimer

Use at your own risk. The Gemini Chat script comes with ABSOLUTELY NO WARRANTY, NO GUARANTEES, NO MERCHANTABILITY, AND NO FITNESS FOR A PARTICULAR PURPOSE.

- [Gemini Apps Privacy Notice](https://support.google.com/gemini/answer/13594961?hl=en)

## License

Gemini Chat script is distributed under [Apache 2.0 License](https://github.com/ChrisWinters/gemini-chat/blob/main/LICENSE)
