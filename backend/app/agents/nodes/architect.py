import json
import os
from typing import Dict, Any, List
from app.agents.state import AgentState
from app.core.config import settings

def _llm_design_architecture(
    problem_statement: str,
    problem_analysis: Dict[str, Any],
    product_spec: Dict[str, Any],
    tech_preferences: List[str] = None
) -> Dict[str, Any]:
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
    
    if api_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain_core.messages import SystemMessage, HumanMessage
            
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=api_key,
                temperature=0.2
            )
            
            prompt = f"""
            You are a Principal Software Architect designing a modern, scalable Hackathon MVP system.
            Problem Statement: {problem_statement}
            Tech Preferences: {tech_preferences or 'Modern Web (FastAPI, Next.js, Postgres)'}
            
            Problem Analysis: {json.dumps(problem_analysis, indent=2)}
            Product Spec: {json.dumps(product_spec, indent=2)}
            
            Generate a detailed Technical Architecture JSON matching this schema:
            {{
                "recommended_tech_stack": {{
                    "frontend": "Next.js 15, TypeScript, Tailwind CSS",
                    "backend": "Python FastAPI, Pydantic, SQLAlchemy",
                    "database": "PostgreSQL with pgvector",
                    "ai_framework": "LangGraph & LangChain",
                    "infrastructure": "Vercel + Render / Railway"
                }},
                "system_components": [
                    {{
                        "name": "Component 1",
                        "role": "Role description",
                        "technologies": ["Tech A", "Tech B"]
                    }}
                ],
                "database_schema": [
                    {{
                        "table_name": "table_name",
                        "description": "Table description",
                        "columns": ["id UUID PK", "name String", "created_at Timestamp"]
                    }}
                ],
                "api_endpoints": [
                    {{
                        "method": "POST",
                        "path": "/api/resource",
                        "description": "Endpoint details",
                        "request_body": "{{ 'field': 'string' }}",
                        "response_body": "{{ 'status': 'success' }}"
                    }}
                ],
                "deployment_strategy": "Hosting plan and deployment setup"
            }}
            """
            response = llm.invoke([
                SystemMessage(content="You return strictly valid JSON."),
                HumanMessage(content=prompt)
            ])
            text = response.content.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()
            return json.loads(text)
        except Exception as e:
            print(f"[Architect] LLM call fallback due to: {e}")

    # Fallback generator
    pref_str = ", ".join(tech_preferences) if tech_preferences else "Next.js, FastAPI, PostgreSQL"
    return {
        "recommended_tech_stack": {
            "frontend": "Next.js (App Router), TypeScript, Tailwind CSS, Lucide React",
            "backend": "Python, FastAPI, Pydantic v2, SQLAlchemy ORM",
            "database": "PostgreSQL (with pgvector for semantic search)",
            "ai_framework": "LangGraph, LangChain, Google Gemini API / OpenAI",
            "deployment": "Vercel (Frontend) + Render / Docker (Backend API)"
        },
        "system_components": [
            {
                "name": "Frontend Web Application",
                "role": "Interactive single-page UI for submitting problem statements, viewing live agent progress, and rendering interactive project blueprints.",
                "technologies": ["Next.js 15", "TypeScript", "Tailwind CSS", "Shadcn UI"]
            },
            {
                "name": "FastAPI Agent Orchestration Server",
                "role": "REST API service exposing blueprint endpoints and driving the stateful multi-agent execution pipeline.",
                "technologies": ["FastAPI", "Uvicorn", "Pydantic", "Python 3.13"]
            },
            {
                "name": "LangGraph Multi-Agent Engine",
                "role": "Stateful directed graph agent workflow executing Problem Analysis -> Product Spec -> Technical Architecture synthesis.",
                "technologies": ["LangGraph", "LangChain Core", "Gemini 1.5 Flash / GPT-4o"]
            },
            {
                "name": "Database & Vector Store Layer",
                "role": "Relational persistence of blueprints, user projects, and vector embeddings for semantic search.",
                "technologies": ["PostgreSQL", "pgvector", "SQLAlchemy"]
            }
        ],
        "database_schema": [
            {
                "table_name": "blueprints",
                "description": "Stores generated hackathon project blueprints and agent states.",
                "columns": [
                    "id: VARCHAR(36) PRIMARY KEY",
                    "title: VARCHAR(255) NOT NULL",
                    "problem_statement: TEXT NOT NULL",
                    "problem_analysis: JSONB",
                    "product_spec: JSONB",
                    "technical_architecture: JSONB",
                    "status: VARCHAR(50)",
                    "created_at: TIMESTAMP WITH TIME ZONE",
                    "updated_at: TIMESTAMP WITH TIME ZONE"
                ]
            },
            {
                "table_name": "agent_execution_logs",
                "description": "Audit trail of multi-agent execution steps and node outputs.",
                "columns": [
                    "id: VARCHAR(36) PRIMARY KEY",
                    "blueprint_id: VARCHAR(36) REFERENCES blueprints(id)",
                    "node_name: VARCHAR(100)",
                    "output_state: JSONB",
                    "timestamp: TIMESTAMP"
                ]
            }
        ],
        "api_endpoints": [
            {
                "method": "POST",
                "path": "/api/blueprints",
                "description": "Submits problem statement and triggers complete multi-agent graph execution.",
                "request_body": "{\n  \"problem_statement\": \"string\",\n  \"title\": \"string?\",\n  \"target_audience\": \"string?\",\n  \"tech_preferences\": [\"string\"]\n}",
                "response_body": "{\n  \"id\": \"uuid-string\",\n  \"title\": \"Project Blueprint Title\",\n  \"problem_analysis\": {...},\n  \"product_spec\": {...},\n  \"technical_architecture\": {...},\n  \"status\": \"completed\"\n}"
            },
            {
                "method": "GET",
                "path": "/api/blueprints",
                "description": "Fetches list of all generated project blueprints.",
                "request_body": "None",
                "response_body": "[ BlueprintResponse ]"
            },
            {
                "method": "GET",
                "path": "/api/blueprints/{blueprint_id}",
                "description": "Retrieves full details of a specific project blueprint.",
                "request_body": "None",
                "response_body": "BlueprintResponse"
            }
        ],
        "deployment_strategy": "Deploy Next.js frontend to Vercel for fast global CDN delivery. Host FastAPI backend on Render or Railway with managed PostgreSQL. Configure env variables for database connection strings and LLM API keys."
    }

def design_architecture_node(state: AgentState) -> Dict[str, Any]:
    print("--- [NODE: TECHNICAL ARCHITECT] ---")
    problem_statement = state.get("problem_statement", "")
    problem_analysis = state.get("problem_analysis", {})
    product_spec = state.get("product_spec", {})
    tech_preferences = state.get("tech_preferences", [])
    
    arch = _llm_design_architecture(problem_statement, problem_analysis, product_spec, tech_preferences)
    
    return {
        "technical_architecture": arch,
        "current_step": "completed"
    }
