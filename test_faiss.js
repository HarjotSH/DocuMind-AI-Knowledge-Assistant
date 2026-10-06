const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { embeddingsModel } = require('./backend/config/langchain');
require('dotenv').config({ path: './backend/.env' });

async function test() {
  try {
    const docs = [
      { pageContent: 'Hello world', metadata: { filename: 'test.pdf' } }
    ];
    console.log("Creating store...");
    const vectorStore = await FaissStore.fromDocuments(docs, embeddingsModel);
    console.log("Store created.");
  } catch (err) {
    console.error("Caught error:", err);
  }
}
test();
