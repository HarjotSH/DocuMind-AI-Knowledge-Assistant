# DocuMind — AI Knowledge Assistant

DocuMind is a **MERN-stack AI Knowledge Management Platform** that allows users to upload documents and interact with them through a conversational AI interface.

The application uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from uploaded documents and provide context-aware responses using **Google Gemini**. Document embeddings are stored in **FAISS** for similarity-based retrieval.

## ✨ Features

* 🔐 User registration and authentication
* 📄 Upload and manage documents
* 🤖 AI-powered conversational interface
* 🔎 Retrieval-Augmented Generation (RAG)
* 🧠 Google Gemini integration
* 📚 Document chunking and vector embeddings
* ⚡ FAISS-based similarity search
* 💬 Context-aware responses based on uploaded documents
* 📊 Document and user activity dashboard
* 🗂️ Document library for managing uploaded files

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* MongoDB

### AI / RAG

* Google Gemini
* LangChain
* FAISS
* Vector Embeddings

### Development Tools

* Git
* GitHub
* npm
* Postman

## 📁 Project Structure

```text
DocuMind-AI-Knowledge-Assistant/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── test_*.js
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

## 🚀 Setup Instructions

### Prerequisites

Before running the project, make sure the following are installed:

* [Node.js](https://nodejs.org/)
* npm
* MongoDB
* Git

You will also need a **Google Gemini API key** for the AI functionality.

### 1. Clone the Repository

```bash
git clone https://github.com/HarjotSH/DocuMind-AI-Knowledge-Assistant.git
cd DocuMind-AI-Knowledge-Assistant
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_gemini_api_key
```

Start the backend development server:

```bash
npm run dev
```

The backend will typically run on:

```text
http://localhost:3000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will typically run on:

```text
http://localhost:5173
```

## 💻 Usage

Once both the backend and frontend servers are running:

1. Open `http://localhost:5173` in your browser.
2. Create a new account or log in.
3. Upload documents through the document management interface.
4. Allow the application to process and index the uploaded documents.
5. Open the conversational AI interface.
6. Ask questions related to the uploaded documents.
7. DocuMind retrieves relevant document content and provides it to the LLM as context.
8. Review and manage your documents through the dashboard.

## 🏗️ Architecture Overview

DocuMind follows a **MERN + RAG architecture** with separate frontend and backend layers.

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │  Document + Chat UI │
                    └──────────┬──────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │    Backend API      │
                    └──────┬───────┬──────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
     ┌─────────────────┐                ┌─────────────────┐
     │     MongoDB     │                │   RAG Pipeline  │
     │ Users / Docs /  │                │ Chunking +      │
     │ Application Data│                │ Embeddings      │
     └─────────────────┘                └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │      FAISS      │
                                        │  Vector Store   │
                                        └────────┬────────┘
                                                 │
                                          Relevant Chunks
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │   Google Gemini │
                                        │       LLM       │
                                        └────────┬────────┘
                                                 │
                                            AI Response
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │   React Chat UI │
                                        └─────────────────┘
```

### Core Components

**Frontend**

React is responsible for the user interface, including authentication, document management, dashboard functionality, and the conversational AI interface.

**Backend**

Node.js and Express.js provide the REST API layer, authentication, business logic, document processing, and integration with the RAG pipeline.

**MongoDB**

MongoDB stores application data such as users, document metadata, chat-related information, and other persistent data.

**Vector Store**

FAISS is used to store and search document embeddings using vector similarity, allowing the application to retrieve relevant document chunks for user queries.

**LLM**

Google Gemini generates responses using the relevant document context retrieved by the RAG pipeline.

## 🧠 How RAG Works

DocuMind uses Retrieval-Augmented Generation to connect user questions with information contained in uploaded documents.

The general flow is:

```text
Document Upload
      │
      ▼
Document Processing
      │
      ▼
Text Extraction / Chunking
      │
      ▼
Generate Embeddings
      │
      ▼
Store Embeddings in FAISS
      │
      │
      │        User Question
      │              │
      │              ▼
      │       Query Embedding
      │              │
      │              ▼
      └──────► Similarity Search
                     │
                     ▼
              Relevant Chunks
                     │
                     ▼
              Google Gemini
                     │
                     ▼
               AI Response
```

### Query Flow

When a user asks a question:

1. The user's query is processed and converted into an embedding.
2. FAISS performs a similarity search against the stored document embeddings.
3. The most relevant document chunks are retrieved.
4. The retrieved context is combined with the user's question.
5. The contextual prompt is sent to Google Gemini.
6. Gemini generates a response using the retrieved document context.
7. The response is returned to the user through the chat interface.

This approach allows the application to answer questions using information retrieved from the user's uploaded knowledge base rather than relying solely on the LLM's pre-trained knowledge.

## 🤖 LLM Usage

Large Language Models are primarily used for the conversational AI component.

Google Gemini is responsible for generating natural-language responses after relevant information has been retrieved from the document vector store.

The LLM therefore acts as the **generation layer**, while FAISS and the retrieval pipeline provide the **knowledge/context layer**.

## 🔌 API Documentation

Detailed API documentation is available in:

```text
backend/API_DOCUMENTATION.md
```

The backend API includes endpoints for authentication, document management, and conversational AI.

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/profile
```

### Documents

```text
POST /api/v1/documents/upload
GET  /api/v1/documents
```

### Conversational AI

```text
POST /api/v1/chat/message
```

For complete request/response details, refer to:

```text
backend/API_DOCUMENTATION.md
```

## 🔒 Environment Variables

Do not commit your `.env` file or API keys to GitHub.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_gemini_api_key
```

Make sure sensitive credentials are included in `.gitignore`.

## 📌 Future Improvements

Potential improvements for the project include:

* Streaming LLM responses
* Support for additional document formats
* Improved document processing and chunking strategies
* Conversation history management
* Source citations for retrieved document chunks
* Improved RAG evaluation and retrieval metrics

## 📄 License

This project is intended for learning and portfolio purposes.
