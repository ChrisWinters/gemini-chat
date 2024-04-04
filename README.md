# Terminal Gemini AI Chat

Use the terminal to interact with Google's Gemini AI.

## Features

- Runs on Windows, Mac, and Linux
- Test command ` npm run test ` - Gemini will tell you a joke and explain it
  - The jokes are rarely funny, while the explanations often are
- Chat command ` npm run chat ` - Activates the interactive chat prompt
  - Use cases: Ask a question, code review/help, write an article, research
  - Type 'exit' to quit, or press CTRL/CMD+C
- Image command ` npm run img ` - Activates the image query and text prompt
  - Use cases: Captioning an image, identifying what an image is, or what's in an image
  - Add images (jpg, png, gif) to the /images/ directory, then select image(s) when prompted

### First time use

When any command above is first used a prompt with ask you for your Google AI Studio API key.

To skip this step manually create a ` .env ` file, then add the API KEY variable with your Google AI Studio API Key.

```js
API_KEY=your-api-key
TOKENS=500
TEMPERATURE=0.9
TOPP=0.95
TOPK=3
```

### Tokens

By default max tokens is set to 500, which is about 35,000 words.

A token is equivalent to about 4 characters. 100 tokens are about 60-80 English words.

## Requirements

- [API Key](https://aistudio.google.com/app/apikey) from Google AI Studio
- [Node.js](https://nodejs.org/en/download) version 20 and above
  - Check Node.js version: ` node --version `
- [Git](https://git-scm.com/downloads) * Optional but recommended
  - Check Git version: ` git --version `

## Install and setup project

> **Do not share confidential or personal information with Gemini AI.**

1. Get an [API Key](https://aistudio.google.com/app/apikey) from Google AI Studio
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
     - **Mac/Linux** terminal: ` curl -c -O https://github.com/ChrisWinters/gemini-chat/raw/main/gemini-chat.zip `
     - Unzip the gemini-chat.zip file
       - **Windows** terminal: ` tar -xf gemini-chat.zip `
       - **Mac** terminal: ` tar -xvf gemini-chat.zip `
       - **Linux** terminal: ` tar -xzf gemini-chat.zip `
     - Delete the zip file: ` rm gemini-chat.zip `
5. Change directories into the Gemini chat directory: ` cd gemini-chat `
6. Install build packages: ` npm install `
7. Run any of the commands

Personal Gemini Chat is now ready to use.

## Commands

Command              | Script                       | Description
---                  | ---                          | ---
``` npm install ```  |                              | Install dependencies
``` npm run test ``` | ``` node index.js --test ``` | Runs test prompt
``` npm run chat ``` | ``` node index.js --chat ``` | Runs interactive chat prompt
``` npm run img ```  | ``` node index.js --img ```  | Runs image query prompt

## Credits

- [Get started with the Gemini API in Node.js applications](https://ai.google.dev/tutorials/get_started_node)
- [Master the Gemini API: A Node.js tutorial with real examples](https://www.youtube.com/watch?v=Z8F6FvMrN4o)

## Disclaimer

Use at your own risk. The Gemini Chat script comes with ABSOLUTELY NO WARRANTY, NO GUARANTEES, NO MERCHANTABILITY, AND NO FITNESS FOR A PARTICULAR PURPOSE.

- [Gemini Apps Privacy Notice](https://support.google.com/gemini/answer/13594961?hl=en)

## License

Distributed under [Apache 2.0 License](https://github.com/ChrisWinters/gemini-chat/blob/main/LICENSE)
