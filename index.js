#!/usr/bin/env node
'use strict'

require('dotenv').config()
const fs = require("fs")
const path = require("path")
const archiver = require("archiver")
const inquirer = require("inquirer")
const mime = require('mime-types')
const readline = require("readline")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const prompt = "Please tell me a unique funny joke. Then explain the joke."
const colors = {
  reset: "\x1b[0m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
}

// Get command-cine argument.
const [arg1] = process.argv.slice(2)

// Argument required.
if (!arg1 || (!arg1.includes("-t") && !arg1.includes("-c") && !arg1.includes("-i") && !arg1.includes("-z"))) {
  console.log(`\nArgument missing: npm run [command]`)
  console.log(`npm run test | Run single response test prompt.`)
  console.log(`npm run chat | Run interactive chat model.`)
  console.log(`npm run img  | Run interactive chat model.`)
  console.log(`npm run zip  | Zip the project.\n`)
  process.exit(0)
}

// Model name for text prompts.
let generativeModel = "gemini-pro"

// Model name for text/image prompts.
if (arg1.includes("-i")) {
  generativeModel = "gemini-pro-vision"
}

// Model parameters for generationConfig and .env file.
const apiKey = (process.env.API_KEY) ? process.env.API_KEY.toString() : null
const maxTokens = (process.env.TOKENS) ? process.env.TOKENS : 500
const temperature = (process.env.TEMPERATURE) ? process.env.TEMPERATURE : 0.9
const topP = (process.env.TOPP) ? process.env.TOPP : 0.95
const topK = (process.env.TOPK) ? process.env.TOPK : 3

// Configuration options for model generation and outputs.
const generationConfig = {
  stopSequences: ["aoeu"],
  maxOutputTokens: Number(maxTokens),
  temperature: Number(temperature),
  topP: Number(topP),
  topK: Number(topK),
}

// Initialize Google Generative AI and pass in API key.
const geminiAI = new GoogleGenerativeAI(apiKey)

// Create GenerativeModel instance for the provided model name.
const model = geminiAI.getGenerativeModel({ model: generativeModel}, generationConfig)

/**
 * Run Questions and Answers prompt.
 * Launch the inquire prompt interface.
 * @param {array} questions Array containing Question Object.
 * @returns array
 */
const inquirerPrompt = async (questions) => {
  return await inquirer.prompt(questions)
    .catch((error) => {
      if (error.isTtyError) {
        console.log("\nInquirer prompt could not be rendered in the current environment.\n")
      } else {
        console.log("\nInquirer error: Something went wrong.\n")
      }
    })
}

/**
 * API Key missing: Inquirer about API Key and maybe create .env file.
 */
const createEnv = async () => {
  console.log("\nEnter a Google Generative AI API Key then press enter.")
  console.log("Create API Key: https://aistudio.google.com/app/apikey\n")

  // Run Questions and Answers prompt. Launch the inquire prompt interface.
  const answer = await inquirerPrompt({
    type: "input",
    name: "api_key",
    message: "API Key >"
  })

  // If API Key was provided.
  if (answer['api_key'].length) {
    const apiKey = answer['api_key'].toString()
    const apiKeyStr = `API_KEY=${apiKey}\n`
    const tokensStr = `TOKENS=${Number(maxTokens)}\n`
    const tempStr = `TEMPERATURE=${Number(temperature)}\n`
    const topPStr = `TOPP=${Number(topP)}\n`
    const topKStr = `TOPK=${Number(topK)}`
    const content = apiKeyStr+tokensStr+tempStr+topPStr+topKStr

    // Asynchronously writes data to a file, replacing the file if it already exists.
    fs.writeFile('.env', content, (error) => {
      if (error) {
        console.log("\nNo action taken: Unable to create .env file.\n")
      } else {
        const command = process.env.npm_lifecycle_event
        console.log("\nCreated .env and saved API Key data.")
        console.log(`Run the command again: npm run ${command}\n`)
      }
    })
  // No API Key provided.
  } else {
    console.log("\nNo action taken: A Google Generative AI API Key is required!\n")
  }
}

/**
 * Test single call to the model.
 * Command: npm run test
 * @param {string} prompt Test prompt for single call model.
 */
const test = async (prompt) => {
  try {
    // Get GenerateContentResponse object.
    const result = await model.generateContent(prompt)
  
    // Maybe get response text and return to console log.
    if (result.response) {
      const reply = result.response.text()
  
      // Display prompt and reply.
      console.log(`\n${colors.magenta}AI >${colors.reset} ${reply}\n`)
      process.exit(0)
    }
  } catch (error) {
    console.error("Error:", error)
    process.exit(0)
  }
}

/**
 * Interactive chat session and prompt loop.
 * Command: npm run chat
 */
const chat = async () => {
  // Start new ChatSession instance used for multi-turn chats.
  const chatSession = model.startChat({
    history: [],
    generationConfig
  })

  // Creates a new readline interface instance.
  const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  /**
   * Ask / response question callback loop.
   */
  const askAndRespond = async (status) => {
    if (!status) {
      console.log("\n\n ==> Type 'exit' to quit.\n")
    }

    read.question(`${colors.yellow}Enter a prompt >${colors.reset} `, async (msg) => {
      // Type exit to quit.
      if (msg.toLowerCase() === "exit") {
        read.close()
        process.exit(0)
      }

      try {
        // Send chat message/receive response as GenerateContentStreamResult containing an iterable stream and a response promise.
        const generateResult = await chatSession.sendMessageStream(msg)
        let text = ""

        if (!text) {
          console.log(`\n${colors.magenta}AI >${colors.reset} `)
        }

        for await (const chunk of generateResult.stream) {
          const response = chunk.text()
          console.log(`${response}`)
          text += response
        }

        // Hook callback to repeat.
        askAndRespond(true)
/**
        // API returned safety error.
        if (generateResult.response.candidates[0].finishReason === "SAFETY") {
          console.log(`\n ==> Gemini returned a safety warning, reword the prompt and try again.\n`)
          process.exit(0)
        }

        // Maybe get response text and return to console log.
        if (generateResult.response.candidates[0].finishReason === "STOP") {
          const response = generateResult.response.text()
          console.log(`\nAI > ${response}\n`)
        }
 */
      } catch (error) {
        console.error("Error:", error)
        process.exit(0)
      }
    })
  }

  askAndRespond(false)
}

/**
 * Image prompt session.
 * Command: npm run img
 */
const img = async () => {
  const filePart = (path, mimeType) => {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      }
    }
  }

  try {
    // Read the contents of the images directory
    const files = fs.readdirSync('./images')
    let imgPrompt = ''
    let imgFiles = []
    let imgParts = []
    let i = 0

    // Loop through the files and print the name of each file
    files.forEach(file => {
      if (file.includes(".jpg") || file.includes(".jpeg") || file.includes(".gif") || file.includes(".png")) {
        imgFiles[i] = file
        ++i
      }
    })

    const answer = inquirerPrompt([{
      type: "checkbox",
      name: "images",
      choices: imgFiles,
      message: "Select image(s) >"
    },{
      type: "input",
      name: "prompt",
      message: "Image Prompt >",
      default: "Can you tell me what this is an image of?"
    }])

    // Get GenerateContentResponse object.
    if (answer['prompt'].length && answer['images'].length) {
      // Loop through the files and print the name of each file
      answer['images'].forEach(file => {
        imgParts = [filePart(`./images/${file}`, mime.lookup(`./images/${file}`))]
      })

      // Single non-streaming call to the model, returns object containing a single GenerateContentResponse.
      const result = await model.generateContent([imgPrompt, ...imgParts])
  
      // Maybe get response text and return to console log.
      if (result.response) {
        const reply = result.response.text()
    
        // Display prompt and reply.
        console.log(`\n${colors.yellow}Prompt >${colors.reset} ${prompt}\n`)
        console.log(`\n${colors.magenta}AI >${colors.reset} ${reply}\n`)
        process.exit(0)
      }
    } else {
      console.log("\nNo action taken: Image selection and image prompt required.\n")
      process.exit(0)
    }
  } catch (error) {
    console.error("Error:", error)
    process.exit(0)
  }
}

/**
 * Create project zip file
 * Creates gemini-chat.zip in current directory
 * Command: npm run zip
 */
const zip = () => {
  const zipFile = path.resolve(__dirname,'gemini-chat.zip')
  const indexFile = path.resolve(__dirname,'index.js')
  const indexStream = fs.createReadStream(indexFile)
  const packageFile = path.resolve(__dirname,'package.json')
  const packageStream = fs.createReadStream(packageFile)
  const packageLockFile = path.resolve(__dirname,'package-lock.json')
  const packageLockStream = fs.createReadStream(packageLockFile)
  const licenseFile = path.resolve(__dirname,'LICENSE')
  const licenseStream = fs.createReadStream(licenseFile)
  const testImage = path.resolve(__dirname,'images/test.png')
  const imageStream = fs.createReadStream(testImage)

  // Verify index.js exists.
  indexStream.on('error', function(error) {
    if (error.code === "ENOENT") {
      console.log(`\nUnable to resolve: ${indexFile}.\n`)
      process.exit(0)
    } else {
      throw error
    }
  })

  // Verify package.json exists.
  packageStream.on('error', function(error) {
    if (error.code === "ENOENT") {
      console.log(`\nUnable to resolve: ${packageFile}.\n`)
      process.exit(0)
    } else {
      throw error
    }
  })

  // Verify package-cock.json exists.
  packageLockStream.on('error', function(error) {
    if (error.code === "ENOENT") {
      console.log(`\nUnable to resolve: ${packageLockFile}.\n`)
      process.exit(0)
    } else {
      throw error
    }
  })

  // Verify LICENSE exists.
  licenseStream.on('error', function(error) {
    if (error.code === "ENOENT") {
      console.log(`\nUnable to resolve: ${licenseFile}.\n`)
      process.exit(0)
    } else {
      throw error
    }
  })

  // Create a file to stream archive data to.
  const output = fs.createWriteStream(zipFile)
  const archive = archiver("zip", {
    zlib: { level: 9 },
  })

  /**
  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  */
  output.on("end", function () {
    console.log('\nNode stream error: Data has been drained.\n')
    process.exit(0)
  })

  // Pipe archive data to the file.
  archive.pipe(output)

  // Append files from a sub-directory, putting its contents at the root of archive.
  archive.append(indexStream, { name: 'index.js' })
  archive.append(packageStream, { name: 'package.json' })
  archive.append(packageLockStream, { name: 'package-lock.json' })
  archive.append(licenseStream, { name: 'LICENSE' })
  archive.append(imageStream, { name: 'images/test.png' })

  // Stat failures and other non-blocking errors.
  archive.on("warning", function (error) {
    if (error.code === "ENOENT") {
      console.log('\nArchiver error: No such directory entry.\n')
      process.exit(0)
    } else {
      throw error
    }
  })

  // Catch error explicitly.
  archive.on("error", function (error) {
    console.error('\nArchiver error: \n', error)
    process.exit(0)
  })

  // Finished receiving and writing data.
  output.on('finish', () => {
    console.log('\nZip file created')
    console.log(`File: ${zipFile}`)
  })

  // Listen for all archive data to be written.
  // Event 'close' is fired only when a file descriptor is involved.
  output.on('close', function() {
    const bytes = archive.pointer()
    const mb = (bytes/1014)
    console.log(`Size: ${Math.round(mb * 100) / 100}mb\n`)
  })

  // Finalize the archive (ie we are done appending files but streams have to finish yet),
  // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand.
  archive.finalize()
}

/**
 * Init Gemini AI.
 */
const init = () => {
  // API Key Required.
  if (!apiKey) {
    createEnv()
    return
  }

  if (arg1.includes("-t")) {
    test(prompt)
  }

  if (arg1.includes("-c")) {
    chat()
  }

  if (arg1.includes("-i")) {
    img()
  }

  if (arg1.includes("-z")) {
    zip()
  }
}

init()
