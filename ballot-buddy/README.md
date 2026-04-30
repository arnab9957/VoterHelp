# 🗳️ Ballot Buddy

**Ballot Buddy** is an AI-powered, non-partisan election assistance platform. It uses cutting-edge Large Language Models (Google Gemini 2.5) to guide users through the complex voting lifecycle—from verifying registration deadlines to explaining ethical campaign finance rules.

## ✨ Features

- **Conversational Guidance:** Real-time, streaming AI chat interface powered by the Vercel AI SDK and Google Gemini.
- **Vision Integration:** Users can upload election documents or mailers for the AI to analyze securely using Gemini's Vision capabilities.
- **International Support:** While primarily built around the National Voter Registration Act (NVRA), it dynamically detects and localizes guidance for global regions, including robust support for India.
- **Robust Architecture:** 
  - Strictly typed API payloads using **Zod**.
  - Persistent chat sessions managed via the **InsForge** database.
  - Highly modular React UI utilizing custom hooks (`useChatSession`, `useChatLogic`) for clean separation of concerns.
- **Security-First:** Rate limiting on chat endpoints and sanitized markdown rendering.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS, Glassmorphism UI
- **AI / LLM:** Google Gemini 2.5 Flash / Pro via `@ai-sdk/google`
- **Database:** InsForge SDK (PostgreSQL backend)
- **Validation:** Zod
- **Deployment:** Docker & Google Cloud Run

## 🚀 Getting Started Locally

### 1. Clone & Install
```bash
git clone <repository-url>
cd ballot-buddy
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your keys:
```env
GEMINI_API_KEY=your_google_gemini_key
INSFORGE_API_KEY=your_insforge_api_key
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment (Google Cloud Run)

The application includes a production-ready multi-stage `Dockerfile`. You can deploy it directly from the source code using the Google Cloud CLI.

### Prerequisites
- Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install)
- Authenticate via `gcloud auth login`
- Enable required APIs: `gcloud services enable run.googleapis.com cloudbuild.googleapis.com`

### Deploy Command
```bash
gcloud run deploy ballot-buddy \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_key,INSFORGE_API_KEY=your_key"
```

## 📜 License
This project is for educational and hackathon purposes. Ensure all AI-generated content is vetted against official state and local election board resources.
