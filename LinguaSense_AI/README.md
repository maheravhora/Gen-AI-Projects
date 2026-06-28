# LinguaSense AI 🌍🤖

LinguaSense AI is a premium, production-quality, full-stack Generative AI multilingual communication assistant that goes far beyond basic translation. It detects context, preserves tones, analyzes emotions, corrects grammar, explains translation pipelines, and translates voice, images (OCR), and documents (PDF) using entirely **free, open-source local AI models**.

Designed with a high-end SaaS product aesthetic inspired by ChatGPT, Claude AI, Notion AI, and Linear, it delivers a visually stunning, polished experience tailored for real-world portfolios and startup-grade demonstrations.

---

## Key Features

- **Context-Aware Translation**: Optimizes translations based on specific domains (Business, Medical, Legal, IT, Travel, Education).
- **AI Translation Analysis Panel**: A glassmorphism dashboard beside the output visualizing the entire translation pipeline:
  - **Language Detection**: Confidently auto-detects source text language.
  - **Grammar Correction**: Highlights and corrects grammar errors before translation to increase output fluency.
  - **Tone & Context Recognition**: Adapts text using specific register markers (Formal, Professional, Friendly, Academic, Simple) and visualizes tone metrics.
  - **Quality Metrics**: Sequential progress rings displaying Translation Confidence, Grammar, Context Match, Fluency, and Naturalness.
  - **Translation Notes**: High-level, observable processing explanations.
- **Voice Studio**: Speech-to-Text transcription (faster-whisper) and Text-to-Speech synthesis (gTTS) with real-time waveform visualization.
- **OCR Scanner**: Extract text from images (EasyOCR) and translate it instantly.
- **PDF Extractor**: Parse and translate whole PDF documents page-by-page.
- **Activity & History**: Save, search, filter, export (CSV), and favorite your previous translations.

---

## Tech Stack & Open-Source Models

### Frontend
- **React (Vite)** + **Tailwind CSS v4** (Modern design, glassmorphism, animated gradients, custom styling)
- **Framer Motion** (Smooth transitions, sequential element loads, hover glows)
- **React Router** (Fluid page routing)
- **React Icons** & **Axios**

### Backend
- **FastAPI** + **Uvicorn** (Asynchronous Python API server)
- **SQLAlchemy** + **aiosqlite** (SQLite async DB engine for storing history/favorites)

### AI Models & Libraries
- **`facebook/nllb-200-distilled-600M`** (Sequence-to-sequence translation supporting 200+ languages)
- **`faster-whisper`** (High-speed, local speech transcription)
- **`EasyOCR`** (Multi-lingual local optical character recognition)
- **`gTTS`** (Google Text-to-Speech synthesizer)
- **`language-tool-python`** (Local grammar verification wrapper)
- **`langdetect`** (Fast language identifier)

---

## Deployment & Setup

### Option 1: Docker (Recommended)
Launch the entire environment with a single command:
```bash
docker-compose up --build
```
- **Frontend URL**: `http://localhost:3000`
- **Backend API URL**: `http://localhost:8000`
- **Interactive OpenAPI Docs**: `http://localhost:8000/docs`

### Option 2: Local Development Setup

#### Backend Setup
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (Python 3.10 or 3.11 is recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend Setup
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## Architecture & Code Quality
- **SOLID Principles**: Separated routers, controllers, services, database models, and Pydantic validation schemas.
- **Thread-safe Lazy Loading**: Heavy translation, OCR, and speech models are only loaded into memory on first use, protected by mutual exclusion locks, preventing initial startup lags.
- **Asynchronous Execution**: Fully uses async SQLite calls (`aiosqlite`) to keep request loops fast and non-blocking.
