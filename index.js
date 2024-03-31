#!/usr/bin/env node
'use strict'

require('dotenv').config()
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
if (!arg1 || (!arg1.includes("-t") && !arg1.includes("-l"))) {
  console.log(`\nArgument missing: npm run chat [-arg]`)
  console.log(`npm run chat -t [-test --test] | Run single response test prompt.`)
  console.log(`npm run chat -l [-live --live] | Run live chat model.\n`)
  process.exit(0)
}

/**
 * Test single call to the model.
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
