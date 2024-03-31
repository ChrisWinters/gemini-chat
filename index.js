#!/usr/bin/env node
'use strict'

require('dotenv').config()
const fs = require("fs")
const path = require("path")
const archiver = require("archiver")
const readline = require("readline")
const { GoogleGenerativeAI } = require("@google/generative-ai")

// Set GenerativeMode name: gemini-pro|gemini-pro-vision
const apiModel = "gemini-pro"

// Maximum tokens to use for API replies.
const maxChatTokens = 500

// Test prompt for single call model.
const prompt = "Select any unique word related to Google and create a fun initialism, then explain it."

// API Key Required.
if (!process.env.API_KEY) {
  console.log(`\nNo action taken: Missing Google Generative AI API Key\n`)
  process.exit(0)
}

// Creates a new readline interface instance.
const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Initialize Google Generative AI and pass in API key.
const geminiAI = new GoogleGenerativeAI(process.env.API_KEY)

// Create GenerativeModel instance for the provided model name.
const model = geminiAI.getGenerativeModel({ model: apiModel})

// Get command-line argument.
const [arg1] = process.argv.slice(2)

// Argument required.
if (!arg1 || (!arg1.includes("-t") && !arg1.includes("-l") && !arg1.includes("-z"))) {
  console.log(`\nArgument missing: npm run chat [-arg]`)
  console.log(`npm run chat -t [-test --test] | Run single response test prompt.`)
  console.log(`npm run chat -l [-live --live] | Run live chat model.\n`)
  console.log(`npm run chat -z [-zip --zip]   | Zip the project.\n`)
  process.exit(0)
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
      console.log(`\nPrompt: ${prompt}`)
      console.log(`Response: ${reply}\n`)
      process.exit(0)
    }
  } catch (error) {
    console.error("Error:", error)
    process.exit(0)
  }
}

if (arg1.includes("-t")) {
  test(prompt)
}

/**
 * Hook chat session and prompt loop.
 * Command: npm run chat
 */
const chat = async () => {
  // Start new ChatSession instance used for multi-turn chats.
  const chatSession = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: maxChatTokens,
    }
  })

  /**
   * Ask / response question callback loop.
   */
  const askAndRespond = async (status) => {
    if (!status) {
      console.log("\n\n ==> Type 'exit' to quit.\n")
    }

    read.question("Enter a prompt > ", async (msg) => {
      // Type exit to quit.
      if (msg.toLowerCase() === "exit") {
        read.close()
        process.exit(0)
      }

      try {
        // Sends a chat message and receives a non-streaming GenerateContentResult.
        const generateResult = await chatSession.sendMessage(msg)

        // API returned safety error.
        if (generateResult.response.candidates[0].finishReason === "SAFETY") {
          console.log(`\n ==> Gemini returned a safety warning, reword the prompt and try again.\n`)
          process.exit(0)
        }

        // Maybe get response text and return to console log.
        if (generateResult.response.candidates[0].finishReason === "STOP") {
          const response = generateResult.response.text()
          console.log(`\nAI > ${response}\n`)

          // Hook callback to repeat.
          askAndRespond(true)
        }
      } catch (error) {
        console.error("Error:", error)
        process.exit(0)
      }
    })
  }

  askAndRespond(false)
}

if (arg1.includes("-l")) {
  chat()
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

  // Verify package-lock.json exists.
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

  output.on('finish', () => {
    console.log('\nZip file created')
    console.log(`File: ${zipFile}`)
  })

  // Listen for all archive data to be written.
  // Event 'close' is fired only when a file descriptor is involved.
  output.on('close', function() {
    const bytes = archive.pointer();
    const mb = (bytes/1014)
    console.log(`Size: ${Math.round(mb * 100) / 100}mb\n`)
  })

  // Finalize the archive (ie we are done appending files but streams have to finish yet),
  // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand.
  archive.finalize()
}

if (arg1.includes("-z")) {
  zip()
}
