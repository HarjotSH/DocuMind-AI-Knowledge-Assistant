const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { TaskType } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
  try {
    const embeddingsModel = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001", 
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
      apiKey: process.env.GOOGLE_API_KEY,
    });
    const embeddings = await embeddingsModel.embedDocuments(["Hello world"]);
    console.log("Embeddings generated", embeddings.length, embeddings[0].length);
  } catch (err) {
    console.error("Caught error:", err);
  }
}
test();
