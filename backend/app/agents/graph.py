import sys
import os
import json
from typing import Dict, Any

# Ensure UTF-8 output encoding on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from langgraph.graph import StateGraph, END
from app.agents.state import ProjectState
from app.core.config import settings

def _get_genai_client():
    """Returns direct Google GenAI SDK client if GEMINI_API_KEY is configured."""
    key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if key and key.strip():
        try:
            from google import genai
            return genai.Client(api_key=key.strip())
        except Exception as e:
            print(f"[GenAI Client Warning] {e}")
    return None

def orchestrator_node(state: ProjectState) -> dict:
    """Orchestrator Agent Node."""
    statement = state.get('problem_statement', '').encode('utf-8', errors='replace').decode('utf-8')
    print(f"[LangGraph Orchestrator] Initializing multi-agent pipeline for problem: '{statement[:50]}...'")
    return {"current_step": "research"}

def research_node(state: ProjectState) -> dict:
    """Research Agent Node: Live AI Problem & Market Analysis."""
    problem = state.get("problem_statement", "")
    client = _get_genai_client()

    if client:
        try:
            print(f"[LangGraph Research Agent] Calling live Gemini AI model (gemma-4-26b-a4b-it)...")
            prompt = f"""
            You are a Senior Hackathon Product Strategist. Analyze the following problem statement:
            Problem Statement: {problem}
            
            Return ONLY a valid raw JSON object matching this schema (no extra explanation or markdown block wrappers):
            {{
                "domain_category": "Industry Category (e.g. Healthcare, FinTech, DevTools, EdTech)",
                "core_problem": "Detailed breakdown of the root cause and market gap",
                "target_audience": ["Target User 1", "Target User 2", "Target User 3"],
                "key_pain_points": ["Pain Point 1", "Pain Point 2", "Pain Point 3"],
                "competitive_landscape": "Why this solution wins over existing alternatives",
                "feasibility_score": 90
            }}
            """
            response = client.models.generate_content(
                model="gemma-4-26b-a4b-it",
                contents=prompt
            )
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()

            research_data = json.loads(text)
            return {"research_data": research_data, "current_step": "product"}
        except Exception as e:
            safe_err = str(e).encode('utf-8', errors='replace').decode('utf-8')
            print(f"[Research Agent Error] Live LLM execution exception: {safe_err}")

    # Fallback generator if API key is un-configured or transient network delay occurs
    words = problem.split()[:6]
    topic = " ".join(words)
    return {
        "research_data": {
            "domain_category": "AI Agents & Developer Tools",
            "core_problem": f"High manual latency and process bottlenecks associated with: '{topic}...'. Existing tools lack real-time autonomous coordination.",
            "target_audience": ["Developers & Tech Builders", "Hackathon Teams", "Domain Specialists"],
            "key_pain_points": [
                "Time-consuming manual project setup during 24-48h hackathons",
                "Inconsistent API contract definitions across multi-developer teams",
                "Difficulty translating abstract problem ideas into concrete technical blueprints"
            ],
            "competitive_landscape": "Unlike static boilerplate generators, HackForge AI uses stateful multi-agent graphs to synthesize custom product & technical architecture.",
            "feasibility_score": 92
        },
        "current_step": "product"
    }

def product_node(state: ProjectState) -> dict:
    """Product Agent Node: Live AI Product Specification & Roadmap."""
    problem = state.get("problem_statement", "")
    research = state.get("research_data", {})
    client = _get_genai_client()

    if client:
        try:
            print(f"[LangGraph Product Agent] Calling live Gemini AI model...")
            prompt = f"""
            You are a Senior Technical Product Manager. Generate a Product Specification based on:
            Problem Statement: {problem}
            Research Analysis: {json.dumps(research)}
            
            Return ONLY a valid raw JSON object matching this schema:
            {{
                "project_name": "Creative Catchy Project Name",
                "mvp_features": [
                    {{"name": "MVP Feature 1", "description": "Detailed explanation", "priority": "MVP"}},
                    {{"name": "MVP Feature 2", "description": "Detailed explanation", "priority": "MVP"}},
                    {{"name": "MVP Feature 3", "description": "Detailed explanation", "priority": "MVP"}}
                ],
                "phase2_features": [
                    {{"name": "Post-Hackathon Feature", "description": "Future scope details", "priority": "Future"}}
                ],
                "user_stories": [
                    "As a [user], I want to [action] so that [benefit]."
                ],
                "ux_workflow": [
                    "Step 1: User enters problem statement",
                    "Step 2: AI engine processes input"
                ]
            }}
            """
            response = client.models.generate_content(
                model="gemma-4-26b-a4b-it",
                contents=prompt
            )
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()

            product_spec = json.loads(text)
            return {"product_spec": product_spec, "current_step": "architecture"}
        except Exception as e:
            safe_err = str(e).encode('utf-8', errors='replace').decode('utf-8')
            print(f"[Product Agent Error] Live LLM execution exception: {safe_err}")

    return {
        "product_spec": {
            "project_name": f"{research.get('domain_category', 'AI Platform').split()[0]} Forge AI",
            "mvp_features": [
                {"name": "Problem Statement Parser", "description": "Interactive input interface with intent extraction.", "priority": "MVP"},
                {"name": "Stateful Agent Workflow Engine", "description": "LangGraph multi-agent graph running Orchestrator -> Research -> Product -> Architecture.", "priority": "MVP"},
                {"name": "Blueprint Portal & Exporter", "description": "Dashboard rendering DB schemas, API contracts, and Markdown download.", "priority": "MVP"}
            ],
            "phase2_features": [
                {"name": "Automated Repository Scaffolder", "description": "Auto-generates starter code repository.", "priority": "Future"}
            ],
            "user_stories": [
                "As a developer, I want to input my hackathon problem statement to get an instant structured technical spec.",
                "As a team lead, I want to review recommended API endpoints so my team can start coding immediately."
            ],
            "ux_workflow": [
                "1. User submits problem statement into input form.",
                "2. LangGraph state graph executes multi-agent nodes.",
                "3. Dashboard displays interactive tabs for research, product spec, and tech stack."
            ]
        },
        "current_step": "architecture"
    }

def architecture_node(state: ProjectState) -> dict:
    """Architecture Agent Node: Live AI Technical Architecture, DB Schema & API Design."""
    problem = state.get("problem_statement", "")
    research = state.get("research_data", {})
    product = state.get("product_spec", {})
    client = _get_genai_client()

    if client:
        try:
            print(f"[LangGraph Architecture Agent] Calling live Gemini AI model...")
            prompt = f"""
            You are a Principal Software Architect. Design a production-ready technical architecture for:
            Problem Statement: {problem}
            Research: {json.dumps(research)}
            Product Spec: {json.dumps(product)}
            
            Return ONLY a valid raw JSON object matching this schema:
            {{
                "recommended_tech_stack": {{
                    "frontend": "Next.js 14, TypeScript, Tailwind CSS",
                    "backend": "Python, FastAPI, Pydantic",
                    "agent_framework": "LangGraph, LangChain",
                    "database": "PostgreSQL with pgvector",
                    "deployment": "Vercel + Render"
                }},
                "system_components": [
                    {{"name": "Component 1", "role": "Role description", "technologies": ["Tech A", "Tech B"]}}
                ],
                "database_schema": [
                    {{"table_name": "table_name", "description": "Table purpose", "columns": ["id UUID PK", "column_name DataType"]}}
                ],
                "api_endpoints": [
                    {{"method": "POST", "path": "/api/resource", "description": "Endpoint details", "request_body": "{{}}", "response_body": "{{}}"}}
                ]
            }}
            """
            response = client.models.generate_content(
                model="gemma-4-26b-a4b-it",
                contents=prompt
            )
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()

            arch_spec = json.loads(text)
            return {"architecture_spec": arch_spec, "current_step": "completed"}
        except Exception as e:
            safe_err = str(e).encode('utf-8', errors='replace').decode('utf-8')
            print(f"[Architecture Agent Error] Live LLM execution exception: {safe_err}")

    return {
        "architecture_spec": {
            "recommended_tech_stack": {
                "frontend": "Next.js 14 (App Router), TypeScript, Tailwind CSS",
                "backend": "Python, FastAPI, Pydantic v2, SQLAlchemy",
                "agent_framework": "LangGraph, LangChain, Google Gemini API",
                "database": "PostgreSQL with pgvector extension",
                "deployment": "Vercel (Frontend) + Render / Railway (Backend)"
            },
            "system_components": [
                {"name": "Frontend Web Application", "role": "User interface for problem submission and blueprint rendering.", "technologies": ["Next.js", "TypeScript", "Tailwind CSS"]},
                {"name": "FastAPI Orchestration Backend", "role": "REST API service running LangGraph workflow.", "technologies": ["FastAPI", "Uvicorn", "SQLAlchemy"]},
                {"name": "LangGraph Agent Engine", "role": "Stateful agent workflow graph.", "technologies": ["LangGraph", "LangChain Core"]}
            ],
            "database_schema": [
                {"table_name": "blueprints", "description": "Stores generated hackathon blueprints and agent state.", "columns": ["id: UUID PRIMARY KEY", "problem_statement: TEXT", "research_data: JSONB", "product_spec: JSONB", "architecture_spec: JSONB", "created_at: TIMESTAMP"]}
            ],
            "api_endpoints": [
                {"method": "POST", "path": "/api/generate", "description": "Triggers multi-agent execution and returns complete ProjectState.", "request_body": "{\"problem_statement\": \"string\"}", "response_body": "{\"research_data\": {...}, \"product_spec\": {...}, \"architecture_spec\": {...}}"}
            ]
        },
        "current_step": "completed"
    }

def create_project_graph():
    workflow = StateGraph(ProjectState)

    workflow.add_node("orchestrator", orchestrator_node)
    workflow.add_node("research", research_node)
    workflow.add_node("product", product_node)
    workflow.add_node("architecture", architecture_node)

    workflow.set_entry_point("orchestrator")
    workflow.add_edge("orchestrator", "research")
    workflow.add_edge("research", "product")
    workflow.add_edge("product", "architecture")
    workflow.add_edge("architecture", END)

    return workflow.compile()

project_graph = create_project_graph()

def run_project_workflow(problem_statement: str) -> dict:
    initial_state: ProjectState = {
        "problem_statement": problem_statement,
        "research_data": {},
        "product_spec": {},
        "architecture_spec": {},
        "current_step": "started"
    }
    return project_graph.invoke(initial_state)
