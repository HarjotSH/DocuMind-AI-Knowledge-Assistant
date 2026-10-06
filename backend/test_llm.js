const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
require('dotenv').config();

async function test() {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-3.8-flash",
      temperature: 0, 
      apiKey: process.env.GOOGLE_API_KEY
    });

    const response = await llm.invoke([
        {
          role: 'system',
          content: `You are a helpful AI assistant.`
        },
        {
          role: 'user',
          content: 'Hello'
        }
      ]);
    console.log("Response:", response.content);
  } catch (err) {
    console.error("Caught error:", err);
  }
}
test();
