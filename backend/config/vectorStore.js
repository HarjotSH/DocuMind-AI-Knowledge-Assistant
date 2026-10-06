const { FaissStore } = require('@langchain/community/vectorstores/faiss');
 const fs = require('fs');
const {Document} = require('../models/Document');
const { embeddingsModel } = require('./langchain');
require('dotenv').config();

// Initialize FAISS vector store
const getVectorStore = async () => {
  const directory = process.env.FAISS_DB_PATH || './faissdb';
  // Ensure the directory exists
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  try {
     const faissIndexPath = `${directory}/faiss.index`;
      if (!fs.existsSync(faissIndexPath)) {
        console.log("FAISS index file not found, returning null.");
        return null; // Indicate that no store exists yet
      }
     const vectorStore = await FaissStore.load(directory, embeddingsModel);
      return vectorStore;
    } catch (error) {
     console.log("Error loading FAISS store, likely not found:", error.message);
     return null; // Indicate that no store exists yet
   }
};

// Add document chunks to faiss db
const addDocumentChunks = async (chunks) => {
  let vectorStore = await getVectorStore();

  const documents = chunks.map(chunk => chunk.content);

  const metadatas = chunks.map(chunk => ({
    documentId: chunk.documentId.toString(),
    position: chunk.position,
    filename: chunk.filename // Add filename to metadata
  }));

  // Prepare documents in Langchain format
  const langchainDocuments = documents.map((doc, index) => ({
    pageContent: doc,
    metadata: metadatas[index],
  }));

  // Ensure the directory exists for saving
  const directory = process.env.FAISS_DB_PATH || './faissdb';
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!vectorStore) {
    // If no existing store, create a new one from documents
    vectorStore = await FaissStore.fromDocuments(langchainDocuments, embeddingsModel);
  } else {
    // Otherwise, add documents to the existing store
    await vectorStore.addDocuments(langchainDocuments);
  }

  await vectorStore.save(directory);
};

// Query similar chunks — deduplicated, relevance-filtered
const querySimilarChunks = async (query, userId, n = 5) => {
  const vectorStore = await getVectorStore();

  // No documents have been uploaded yet
  if (!vectorStore) {
    return [];
  }

  // Fetch more candidates than needed so deduplication doesn't leave us empty
  const candidates = n * 4;
  const resultsWithScore = await vectorStore.similaritySearchWithScore(query, candidates);

  // FAISS returns L2 distance — lower = more similar.
  // Drop chunks that are too far away (irrelevant). Tune this threshold as needed.
  const DISTANCE_THRESHOLD = 1.2;

  // Filter by userId first, then by relevance
  const userDocuments = await Document.find({ userId: userId });
  const userDocumentIds = new Set(userDocuments.map(doc => doc._id.toString()));

  const seen = new Set(); // track unique content to remove duplicates
  const uniqueResults = [];

  for (const [doc, score] of resultsWithScore) {
    // Skip chunks not belonging to this user
    if (!userDocumentIds.has(doc.metadata.documentId)) continue;

    // Skip irrelevant chunks
    if (score > DISTANCE_THRESHOLD) continue;

    // Deduplicate by exact content match
    const key = doc.pageContent.trim();
    if (seen.has(key)) continue;
    seen.add(key);

    doc.score = score;
    uniqueResults.push(doc);

    // Stop once we have enough unique relevant chunks
    if (uniqueResults.length >= n) break;
  }

  return uniqueResults;
};



module.exports = {
  getVectorStore,
  addDocumentChunks,
  querySimilarChunks,
};