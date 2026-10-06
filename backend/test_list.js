const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GOOGLE_API_KEY);
    const data = await response.json();
    console.log(data.models.filter(m => m.name.includes('embed')).map(m => m.name));
  } catch (err) {
    console.error("Caught error:", err);
  }
}
test();
