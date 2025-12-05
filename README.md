# CodeAid: LLM-Based Technical Support Assistant Using RAG

![CodeAid](https://img.shields.io/badge/RAG-Powered-purple) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

**CodeAid** is an intelligent technical support assistant that uses **Retrieval-Augmented Generation (RAG)** to help developers understand code, error logs, and technical documentation. Upload your files, ask natural language questions, and get accurate, context-aware answers powered by GPT-4.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [RAG Pipeline Explained](#rag-pipeline-explained)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)

---

## ✨ Features

- **📁 Multiple File Format Support**: Upload `.txt`, `.js`, `.ts`, `.py`, `.java`, `.log`, `.md`, `.docx`, `.xlsx`
- **🤖 RAG-Powered Q&A**: Ask questions and get answers grounded in your uploaded documents
- **🔍 Semantic Search**: Vector similarity search to find the most relevant code/documentation chunks
- **💬 Interactive Chat Interface**: Modern UI with message history and source attribution
- **📊 Relevance Metrics**: View similarity scores for source chunks to assess answer quality
- **👍 User Feedback**: Rate answers with thumbs up/down for evaluation
- **🎨 Modern UI**: Premium glassmorphism design with smooth animations

---

## 🏗️ Architecture

CodeAid implements a **Retrieval-Augmented Generation (RAG)** pipeline:

```mermaid
graph LR
    A[Upload File] --> B[Extract Text]
    B --> C[Chunk Text]
    C --> D[Generate Embeddings]
    D --> E[Store in Vector DB]
    
    F[User Question] --> G[Generate Query Embedding]
    G --> H[Search Similar Chunks]
    H --> I[Retrieve Top-K Matches]
    I --> J[Construct Context]
    J --> K[Generate Answer with LLM]
    K --> L[Display with Sources]
```

### **Pipeline Stages**

1. **File Upload & Processing**
   - Extract text from various file formats (mammoth for .docx, xlsx for .xlsx)
   - Chunk text with configurable size (800 chars) and overlap (100 chars)
   - Generate embeddings using OpenAI `text-embedding-3-small` (1536 dimensions)
   - Store chunks and embeddings in PostgreSQL

2. **Query Processing**
   - Convert user question to embedding vector
   - Compute cosine similarity against all stored chunks
   - Filter by relevance threshold (0.5) and retrieve top-5 matches
   - Format context with source attribution

3. **Answer Generation**
   - Send context + question to GPT-4-turbo
   - System prompt ensures answers are grounded in provided context
   - Return answer with source chunks and similarity scores

---

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Modern styling with custom gradients
- **React Markdown**: Render formatted LLM responses

### **Backend**
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Relational database with array support for embeddings

### **AI & ML**
- **OpenAI API**:
  - `text-embedding-3-small`: Document and query embeddings
  - `gpt-4-turbo`: Answer generation
- **Custom Vector Search**: In-memory cosine similarity (suitable for <1,000 chunks)

### **Libraries**
- **Zod**: Runtime validation
- **Mammoth.js**: .docx text extraction
- **XLSX**: Excel spreadsheet parsing

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 20+ and npm/pnpm/yarn
- **PostgreSQL** 14+ (local or hosted)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd code-aid
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/codeaid"

# OpenAI API
OPENAI_API_KEY="sk-..."
```

> **Note**: Replace `username`, `password`, and the OpenAI key with your actual credentials.

### 4. Set Up Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration

All configuration constants are in [`src/lib/config.ts`](src/lib/config.ts):

```typescript
export const CHUNK_SIZE = 800;           // Characters per chunk
export const CHUNK_OVERLAP = 100;        // Overlap between chunks
export const TOP_K = 5;                   // Number of chunks to retrieve
export const RELEVANCE_THRESHOLD = 0.5;   // Minimum similarity score
export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const CHAT_MODEL = 'gpt-4-turbo';
```

---

## 📖 Usage

### **1. Upload Documents**
- Click or drag files into the upload area
- Supported formats: code files, logs, Markdown, Word docs, Excel sheets
- Files are automatically processed and chunked
- Embeddings are generated and stored

### **2. Ask Questions**
- Type your question in the chat interface
- Examples:
  - "How does the authentication work?"
  - "Explain the error on line 42"
  - "What API endpoints are available?"

### **3. Review Answers**
- Answers are displayed with source attribution
- Click "Sources Used" to see relevant chunks and similarity scores
- Rate answers with 👍 or 👎 for quality tracking

### **4. View Uploaded Documents**
- See all uploaded files in the Documents panel
- View chunk count and metadata
- Delete documents as needed

---

## 🔬 RAG Pipeline Explained

### **Why RAG?**
Large Language Models (LLMs) are trained on general knowledge and can't access your private codebase or documentation. **RAG solves this** by:
1. Storing your documents in a searchable format (embeddings)
2. Retrieving relevant context for each question
3. Providing that context to the LLM to generate grounded answers

### **Chunking Strategy**
- **Size**: 800 characters (balances context vs. granularity)
- **Overlap**: 100 characters (prevents splitting related concepts)
- **Trade-offs**: Larger chunks provide more context but reduce precision; smaller chunks are more precise but may lack context

### **Embedding Model**
- **Model**: `text-embedding-3-small` (1536 dimensions)
- **Efficiency**: Fast and cost-effective for semantic search
- **Similarity**: Cosine similarity measures relevance (0 = unrelated, 1 = identical)

### **Relevance Filtering**
- **Threshold**: 0.5 (chunks below this score are filtered out)
- **Rationale**: Prevents irrelevant context from confusing the LLM
- **Monitoring**: Average similarity scores are logged for quality tracking

### **LLM Prompt Engineering**
- **System Prompt**: Instructs GPT-4 to answer ONLY from provided context
- **Temperature**: 0.3 (low randomness for factual accuracy)
- **Max Tokens**: 1000 (sufficient for most technical explanations)

---

## 📡 API Endpoints

### **POST /api/upload**
Upload and process a file.

**Request:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@example.py"
```

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "clx...",
    "filename": "example.py",
    "fileType": "text/x-python",
    "fileSize": 1024,
    "uploadedAt": "2025-12-05T00:00:00Z"
  },
  "chunksCreated": 5
}
```

---

### **POST /api/ask**
Ask a question about uploaded documents.

**Request:**
```json
{
  "question": "How does authentication work?"
}
```

**Response:**
```json
{
  "answer": "Based on the uploaded code...",
  "sources": [
    {
      "chunk": {
        "id": "clx...",
        "content": "def authenticate(user)...",
        "document": {
          "filename": "auth.py"
        }
      },
      "score": 0.87
    }
  ],
  "question": "How does authentication work?"
}
```

---

### **GET /api/documents**
List all uploaded documents.

**Response:**
```json
{
  "documents": [
    {
      "id": "clx...",
      "filename": "auth.py",
      "fileType": "text/x-python",
      "fileSize": 1024,
      "uploadedAt": "2025-12-05T00:00:00Z",
      "chunkCount": 5
    }
  ]
}
```

---

### **POST /api/feedback**
Submit user feedback on an answer.

**Request:**
```json
{
  "messageId": "1733456789",
  "rating": 5,
  "comment": "Very helpful!"
}
```

**Response:**
```json
{
  "success": true,
  "feedback": {
    "id": "clx...",
    "messageId": "1733456789",
    "rating": 5,
    "comment": "Very helpful!",
    "createdAt": "2025-12-05T00:00:00Z"
  }
}
```

---

## 🗄️ Database Schema

```prisma
model Document {
  id         String   @id @default(cuid())
  filename   String
  fileType   String
  fileSize   Int
  uploadedAt DateTime @default(now())
  chunks     Chunk[]
}

model Chunk {
  id         String   @id @default(cuid())
  content    String   @db.Text
  embedding  Float[]  // 1536-dimensional vector
  documentId String
  document   Document @relation(...)
}

model Feedback {
  id        String   @id @default(cuid())
  messageId String
  rating    Int      // 1-5 scale
  comment   String?
  createdAt DateTime @default(now())
}
```

---

## 📄 License

This project is for educational purposes as part of a technical support assistant demonstration using RAG.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and embedding models
- **Vercel** for Next.js framework
- **Prisma** for excellent ORM tooling
- **Tailwind CSS** for modern styling utilities

---

## 📞 Support

For questions or issues, please review the documentation or check the console logs for detailed error messages.

**Happy coding with CodeAid! 🚀**
