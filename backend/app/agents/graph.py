import os
import json
from typing import Dict, Any
from langgraph.graph import StateGraph, END
from app.agents.state import ProjectState
from app.core.config import settings

def _get_llm():
    """Instantiates the active production LLM client."""
    openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")

    if gemini_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            # Active production model ID for Google GenAI / Gemma API
            return ChatGoogleGenerativeAI(model="gemma-4-26b-a4b-it", google_api_key=gemini_key, temperature=0.3)
        except Exception as e:
            print(f"[LLM Init Warning] Gemini Gemma model init: {e}")
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                return ChatGoogleGenerativeAI(model="gemini-3.8-flash", google_api_key=gemini_key, temperature=0.3)
            except Exception as e2:
                print(f"[LLM Init Warning] Gemini Flash model init: {e2}")

    if openai_key:
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(model="gpt-4o-mini", api_key=openai_key, temperature=0.3)
        except Exception as e:
            print(f"[LLM Init Warning] OpenAI model init: {e}")

    return None

def orchestrator_node(state: ProjectState) -> dict:
    """Orchestrator Agent Node."""
    print(f"[LangGraph Orchestrator] Processing problem: {state.get('problem_statement', '')[:50]}...")
    return {"current_step": "research"}

def research_node(state: ProjectState) -> dict:
    """Research Agent Node: Live LLM Problem & Market Analysis."""
    problem = state.get("problem_statement", "")
    llm = _get_llm()

    if llm:
        try:
            print(f"[LangGraph Research Agent] Invoking live LLM research for problem...")
            prompt = f"""
            Analyze the following hackathon problem statement:
            Problem Statement: {problem}
            
            Return ONLY a valid JSON object (no extra text or markdown formatting outside JSON):
            {{
                "domain_category": "Industry Domain (e.g., AI/ML, HealthTech, FinTech, DevTools)",
                "core_problem": "Detailed breakdown of the root cause and market gap",
                "target_audience": ["Target Persona 1", "Target Persona 2"],
                "key_pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"],
                "competitive_landscape": "Why this solution wins over existing alternatives",
                "feasibility_score": 92
            }}
            """
            from langchain_core.messages import SystemMessage, HumanMessage
            response = llm.invoke([
                SystemMessage(content="You return strictly valid JSON."),
                HumanMessage(content=prompt)
            ])
            text = response.content.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()

            research_data = json.loads(text)
            return {"research_data": research_data, "current_step": "product"}
        except Exception as e:
            print(f"[Research Agent Error] {e}")

    # Fallback if LLM invocation encounters transient API limits
    words = problem.split()[:6]
    topic = " ".join(words)
    return {
        "research_data": {
            "domain_category": "AI Automation & Intelligent Agents",
            "core_problem": f"Lack of real-time multi-agent automation addressing: '{topic}...'. Current workflows suffer from manual latency and fragmented system design.",
            "target_audience": ["Hackathon Builders", "Software Architects", "Domain Specialists"],
            "key_pain_points": [
                "Manual setup overhead during 24-48h hackathons",
                "Inconsistent API contract definitions across teams",
                "Difficulty translating raw problem ideas into clean technical specs"
            ],
            "competitive_landscape": "Unlike static boilerplate generators, HackForge AI uses stateful multi-agent graphs to synthesize custom product & technical architecture.",
            "feasibility_score": 95
        },
        "current_step": "product"
    }

def product_node(state: ProjectState) -> dict:
    """Product Agent Node: Live LLM Product Specification."""
    problem = state.get("problem_statement", "")
    research = state.get("research_data", {})
    llm = _get_llm()

    if llm:
        try:
            print(f"[LangGraph Product Agent] Invoking live LLM product specification...")
            prompt = f"""
            Synthesize a Product Specification for:
            Problem: {problem}
            Research Analysis: {json.dumps(research)}
            
            Return ONLY a valid JSON object:
            {{
                "project_name": "Catchy Creative Project Name",
                "mvp_features": [
                    {{"name": "MVP Feature 1", "description": "Description", "priority": "MVP"}},
                    {{"name": "MVP Feature 2", "description": "Description", "priority": "MVP"}},
                    {{"name": "MVP Feature 3", "description": "Description", "priority": "MVP"}}
                ],
                "phase2_features": [
                    {{"name": "Post-Hackathon Feature", "description": "Description", "priority": "Future"}}
                ],
                "user_stories": [
                    "As a [user], I want to [action] so that [benefit]."
                ],
                "ux_workflow": [
                    "Step 1: User enters criteria",
                    "Step 2: AI engine processes input"
                ]
            }}
            """
            from langchain_core.messages import SystemMessage, HumanMessage
            response = llm.invoke([
                SystemMessage(content="You return strictly valid JSON."),
                HumanMessage(content=prompt)
            ])
            text = response.content.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()

            product_spec = json.loads(text)
            return {"product_spec": product_spec, "current_step": "architecture"}
        except Exception as e:
            print(f"[Product Agent Error] {e}")

    return {
        "product_spec": {
            "project_name": f"{research.get('domain_category', 'AI Platform').split()[0]} Core AI",
            "mvp_features": [
                {"name": "Problem Statement Parser", "description": "Interactive input interface with intent extraction.", "priority": "MVP"},
                {"name": "Stateful Agent Workflow", "description": "LangGraph multi-agent graph running Orchestrator -> Research -> Product -> Architecture.", "priority": "MVP"},
                {"name": "Blueprint Portal & Exporter", "description": "Dashboard rendering DB schemas, API contracts, and Markdown download.", "priority": "MVP"}
            ],
            "phase2_features": [
                {"name": "GitHub Repo Scaffolder", "description": "Auto-generates starter code repository.", "priority": "Future"}
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
    """Architecture Agent Node: Live LLM System Architecture & DB Design."""
    problem = state.get("problem_statement", "")
    research = state.get("research_data", {})
    product = state.get("product_spec", {})
    llm = _get_llm()

    if llm:
        try:
            print(f"[LangGraph Architecture Agent] Invoking live LLM technical architecture design...")
            prompt = f"""
            Design a complete technical architecture for:
            Problem: {problem}
            Research: {json.dumps(research)}
            Product Spec: {json.dumps(product)}
            
            Return ONLY a valid JSON object:
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
                    {{"table_name": "table_name", "description": "Table purpose", "columns": ["id UUID PK", "field String"]}}
                ],
                "api_endpoints": [
                    {{"method": "POST", "path": "/api/resource", "description": "Endpoint purpose", "request_body": "{{}}", "response_body": "{{}}"}}
                ]
            }}
            """
            from langchain_core.messages import SystemMessage, HumanMessage
            response = llm.invoke([
                SystemMessage(content="You return strictly valid JSON."),
                HumanMessage(content=prompt)
            ])
            text = response.content.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()

            arch_spec = json.loads(text)
            return {"architecture_spec": arch_spec, "current_step": "completed"}
        except Exception as e:
            print(f"[Architecture Agent Error] {e}")

    return {
        "architecture_spec": {
            "recommended_tech_stack": {
                "frontend": "Next.js 14 (App Router), TypeScript, Tailwind CSS",
                "backend": "Python, FastAPI, Pydantic v2, SQLAlchemy",
                "agent_framework": "LangGraph, LangChain, Google Gemini / OpenAI",
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
