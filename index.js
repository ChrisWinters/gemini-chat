#!/usr/bin/env node
'use strict'

require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai")

// Set GenerativeMode name: gemini-pro|gemini-pro-vision
const apiModel = "gemini-pro"

// Test prompt for single call model.
const prompt = "Select any unique word related to Google and create a fun initialism, then explain it."

// API Key Required.
if (!process.env.API_KEY) {
  console.log(`\nNo action taken: Missing Google Generative AI API Key\n`)
  process.exit(0)
}

// Initialize Google Generative AI and pass in API key.
const geminiAI = new GoogleGenerativeAI(process.env.API_KEY)

// Create GenerativeModel instance for the provided model name.
const model = geminiAI.getGenerativeModel({ model: apiModel})

// Get command-line argument.
const [arg1] = process.argv.slice(2)

// Argument required.
if (!arg1 || (!arg1.includes("-t"))) {
  console.log(`\nArgument missing: npm run chat [-arg]`)
  console.log(`npm run chat -t [-test --test] | Run single response test prompt.`)
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
