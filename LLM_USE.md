# LLM Usage in DocuMind

DocuMind uses **Google Gemini** as its Large Language Model (LLM) within a Retrieval-Augmented Generation (RAG) pipeline.

## 1. RAG Workflow

```text
User Question
      │
      ▼
Query Embedding
      │
      ▼
FAISS Similarity Search
      │
      ▼
Relevant Document Chunks
      │
      ▼
Context + User Question
      │
      ▼
Google Gemini
      │
      ▼
Generated Response
```

## 2. Process

1. The user submits a question through the chat interface.
2. The query is converted into an embedding.
3. FAISS searches for relevant document chunks.
4. Retrieved chunks are added as context to the user's question.
5. The contextual prompt is sent to Google Gemini.
6. Gemini generates the response.
7. The backend returns the response to the frontend.

## 3. Role of Each Component

| Component       | Role                               |
| --------------- | ---------------------------------- |
| Embedding Model | Converts text into vectors         |
| FAISS           | Retrieves relevant document chunks |
| LangChain       | Supports the RAG workflow          |
| Google Gemini   | Generates the response             |
| React           | Displays the response              |

## 4. Why RAG?

RAG allows DocuMind to retrieve information from uploaded documents and provide it as context to the LLM.

This enables responses to be based on the application's document knowledge base without retraining the LLM whenever new documents are added.

RAG can improve grounding but does not completely eliminate incorrect or hallucinated responses.

## 5. Future Improvements

* Streaming responses
* Conversation history
* Source citations
* Improved chunking
* Better retrieval strategies
