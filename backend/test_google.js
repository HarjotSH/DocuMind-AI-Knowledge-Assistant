const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent("Hello world");
    console.log("Raw embedding length:", result.embedding.values.length);
  } catch (err) {
    console.error("Caught error:", err);
  }
}
test();
