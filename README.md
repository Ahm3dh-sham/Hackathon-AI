# ⚔️ HackForge AI — Autonomous Multi-Agent Project Blueprint

> **Transforming Hackathon Problem Statements into Complete Technical Blueprints in Seconds.**

![Version](https://img.shields.io/badge/version-1.0.0-indigo.svg)
![Framework](https://img.shields.io/badge/LangGraph-Stateful_Agents-purple.svg)
![Backend](https://img.shields.io/badge/FastAPI-0.110-emerald.svg)
![Frontend](https://img.shields.io/badge/Next.js-14_App_Router-black.svg)
![Database](https://img.shields.io/badge/PostgreSQL-pgvector-blue.svg)

---

## 📋 Executive Overview

**HackForge AI** is an autonomous multi-agent platform designed for hackathons and rapid prototyping. It ingests raw hackathon problem statements and orchestrates specialized **LangGraph stateful agents** to synthesize:

1. **Problem Analysis & Market Feasibility**
2. **Product Specification & Feature Roadmap (MVP vs Phase 2)**
3. **Technical Architecture (Microservices, Database Schemas & REST APIs)**
4. **Master Builder Prompt (Ready-to-Paste Prompt for Cursor, Bolt.new, Lovable & v0)**

---

## 🎨 Editorial Blueprint Studio & Interactive Stack

The frontend features an **Old-Money Editorial Blueprint Studio** design system (**Warm Linen `#f7f4ed`**, **Ivory Paper `#fffdf8`**, **Espresso Ink `#292720`**, **Aged Brass `#80643d`**, and **Heritage Forest Green `#394b3f`**) paired with `Cormorant Garamond`, `Manrope`, and `DM Mono` typography, powered by:
* **[GSAP (`greensock/GSAP`)](https://github.com/greensock/GSAP):** Choreographed timeline animations, magnetic hover cards, and SVG flow path transitions.
* **[React Bits (`DavidHDev/react-bits`)](https://github.com/DavidHDev/react-bits):** Interactive Spotlight Cards and animated Spring Number Counters.
* **[Vanta.js (`tengbao/vanta`)](https://github.com/tengbao/vanta):** Three.js 3D interactive topological mesh background (`VantaBackground.tsx`).
* **[Watermelon UI (`WatermelonCorp/watermelon-platform`)](https://github.com/WatermelonCorp/watermelon-platform):** Interactive `Announcement3` top banner and `CarouselNavigator` auto-advancing tab controller with keyboard navigation (`←` / `→`).

---

## 🤖 Multi-Agent Workflow Graph

```mermaid
flowchart LR
    A["Input Problem Statement"] --> B["Orchestrator Agent"]
    B --> C["Research Agent"]
    C --> D["Product Specifier Agent"]
    D --> E["Technical Architect Agent"]
    E --> F["Master Builder Prompt & Editorial Dossier"]
```

### Agent Responsibilities
* **Orchestrator Agent:** Validates input parameters, initializes graph execution state, and coordinates agent transitions.
* **Research Agent:** Performs domain classification, analyzes root causes, identifies target user personas, and evaluates hackathon feasibility scores.
* **Product Specifier Agent:** Generates 24-48h MVP core features, post-hackathon roadmap, key user stories, and UX workflows.
* **Technical Architect Agent:** Formulates recommended technology stacks, designs relational entity database schemas, drafts REST API endpoint contracts, and synthesizes a comprehensive **Master Builder Prompt**.

---

## 📊 Sample Generated Blueprint: HackForge AI Platform

### 1. Research Analysis
* **Domain Category:** AI Multi-Agent Systems & Developer Automation Tools
* **Feasibility Score:** **92/100**
* **Core Problem:** Manual setup and planning consume 30%+ of time during 24-48 hour hackathons. Teams struggle to align on database schemas, feature scoping, and API contracts early.
* **Target Audience:** Hackathon Participants, Startup Founders, Software Architects, and DevOps Teams.
* **Unique Value Proposition:** Eliminates initial planning friction by generating production-ready technical architecture specs in under 15 seconds.

### 2. Product Specification

#### MVP Features (24-48h Scope)
* **Interactive Blueprint Studio:** Real-time problem statement synthesis with 4 curated presets (`Medical Triage`, `Carbon Supply Chain`, `Decentralized Grid`, `Legal Contract Auditor`) and custom prompt support.
* **Stateful LangGraph Engine:** 4-node execution graph supporting sequential and parallel multi-agent synthesis.
* **Editorial Architectural Dossier:** Rich 4-tab visualizer (`Research Analysis`, `Product Specification`, `Technical Architecture`, `Builder Prompt`) with `CarouselNavigator`.
* **One-Click Export (`PDF` & `BLUEPRINT.md`):** Instant high-contrast PDF dossier export (`html2pdf.js`) and Markdown download.

#### Phase 2 Features
* **Automated GitHub Scaffolder:** One-click creation of pre-configured GitHub repositories with Docker & CI/CD workflows.
* **AI Code Workbench:** Automated boilerplate generation for FastAPI routes and SQLAlchemy models.

#### Key User Stories
* *"As a hackathon team lead, I want to input our problem statement so that my team gets an instant technical architecture spec."*
* *"As a developer, I want to review recommended API contracts and database schemas so I can start coding routes immediately."*

---

## 🏗️ Technical Architecture Specification

### Recommended Tech Stack
| Tier | Technology | Description |
|---|---|---|
| **Frontend** | **Next.js 14 (App Router)** | TypeScript, Tailwind CSS, GSAP, Vanta.js, React Bits, Watermelon UI |
| **Backend** | **Python & FastAPI** | Uvicorn, Pydantic v2, Async HTTP |
| **AI Orchestration** | **LangGraph & Google Gemini** | Stateful Directed Agent Graph (`gemini-2.5-flash` + intelligent fallback) |
| **Database** | **PostgreSQL / SQLite** | SQLAlchemy ORM with `pgvector` extension |
| **Deployment** | **Vercel & Render** | Global CDN Frontend + Async Microservices |

### Database Schema Design (`blueprints` Table)
```sql
CREATE TABLE blueprints (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    problem_statement TEXT NOT NULL,
    problem_analysis JSONB,
    product_spec JSONB,
    technical_architecture JSONB,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### REST API Contracts

#### `POST /api/generate`
Triggers the multi-agent graph execution pipeline.
* **Request Body:**
  ```json
  {
    "problem_statement": "Build an autonomous AI agent for medical triage"
  }
  ```
* **Response:** Returns complete `ProjectState` payload containing `research_data`, `product_spec`, and `architecture_spec`.

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/Ahm3dh-sham/Hackathon-AI.git
cd Hackathon-AI
```

### 2. Run Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*API running at `http://localhost:8000` | Swagger Docs at `http://localhost:8000/docs`*

### 3. Run Frontend (Next.js)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
*Web App running at `http://localhost:3000` or `http://127.0.0.1:3000`*

---
*Built with ❤️ for Hackathons using LangGraph, FastAPI, and Next.js.*
