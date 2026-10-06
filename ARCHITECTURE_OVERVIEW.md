# Architecture Overview: DocuMind — AI Knowledge Assistant

DocuMind is a MERN-stack application that combines document management with a Retrieval-Augmented Generation (RAG) pipeline for document-based conversational AI.

## 1. System Components

### Frontend

**React.js**

Handles:

* User authentication
* Document upload and management
* Chat interface
* Dashboard

### Backend

**Node.js + Express.js**

Handles:

* REST APIs
* Authentication and authorization
* Document processing
* RAG workflow
* Gemini integration
* Database operations

### Database

**MongoDB**

Stores:

* User data
* Document metadata
* Application data

### Vector Store

**FAISS**

Stores document embeddings and performs similarity search to retrieve relevant document chunks.

### LLM

**Google Gemini**

Generates responses using the user's query and retrieved document context.

### RAG Framework

**LangChain**

Supports document processing, embeddings, retrieval, and LLM integration.

---

## 2. Architecture Flow

```text
                    User
                      │
                      ▼
               React Frontend
                      │
                  REST API
                      │
                      ▼
              Node.js + Express
                 │          │
                 │          │
                 ▼          ▼
             MongoDB    RAG Pipeline
                            │
                        LangChain
                            │
                            ▼
                          FAISS
                            │
                   Relevant Chunks
                            │
                            ▼
                     Google Gemini
                            │
                            ▼
                    AI Response
                            │
                            ▼
                    React Frontend
```

---

## 3. Document Processing Flow

```text
Document Upload
      │
      ▼
Text Extraction
      │
      ▼
Text Chunking
      │
      ▼
Generate Embeddings
      │
      ▼
FAISS Vector Store
```

Document metadata is stored in MongoDB.

---

## 4. RAG Query Flow

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
Context + Question
      │
      ▼
Google Gemini
      │
      ▼
AI Response
```

---

## 5. Authentication Flow

```text
Login / Register
       │
       ▼
Express API
       │
       ▼
MongoDB
       │
       ▼
JWT Token
       │
       ▼
Authenticated Requests
```

---

## 6. Project Structure

```text
DocuMind-AI-Knowledge-Assistant/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── index.html
│   └── package.json
│
└── README.md
```
