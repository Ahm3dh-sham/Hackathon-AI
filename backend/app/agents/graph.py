import os
import json
from typing import Dict, Any
from langgraph.graph import StateGraph, END
from app.agents.state import ProjectState
from app.core.config import settings

def _get_llm():
    """Instantiates the preferred LangChain LLM client (OpenAI or Gemini)."""
    openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")

    if openai_key:
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(model="gpt-4o-mini", api_key=openai_key, temperature=0.3)
        except Exception as e:
            print(f"[LLM] OpenAI client init warning: {e}")

    if gemini_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_key, temperature=0.3)
        except Exception as e:
            print(f"[LLM] Gemini client init warning: {e}")

    return None

def orchestrator_node(state: ProjectState) -> dict:
    """Orchestrator Agent Node: Logs startup and prepares state."""
    print(f"[LangGraph Orchestrator] Analyzing input problem statement...")
    return {"current_step": "research"}

def research_node(state: ProjectState) -> dict:
    """Research Agent Node: Invokes LLM for real problem and market research."""
    problem = state.get("problem_statement", "")
    llm = _get_llm()

    if llm:
        try:
            print(f"[LangGraph Research Agent] Invoking real LLM analysis...")
            prompt = f"""
            You are a Senior Hackathon Strategist. Perform deep problem and domain analysis for this hackathon idea:
            
            Problem Statement: {problem}
            
            Respond strictly with a valid JSON object matching this schema:
            {{
                "domain_category": "Domain name (e.g. HealthTech, Developer Automation, FinTech)",
                "core_problem": "Detailed description of the underlying root cause",
                "target_audience": ["Target Persona 1", "Target Persona 2"],
                "key_pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"],
                "competitive_landscape": "Analysis of existing solutions and why this stands out",
                "feasibility_score": 88
            }}
            """
            from langchain_core.messages import SystemMessage, HumanMessage
            response = llm.invoke([
                SystemMessage(content="You return strictly valid JSON matching the requested schema without markdown quotes."),
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
            print(f"[Research Agent] LLM execution error: {e}")

    # Heuristic fallback if LLM key is absent
    words = problem.split()[:6]
    topic = " ".join(words)
    return {
        "research_data": {
            "domain_category": "AI Agents & Autonomous Workflows",
            "core_problem": f"High manual effort and workflow bottlenecks associated with: '{topic}...'. Existing tools lack real-time multi-agent coordination.",
            "target_audience": ["Developers & Technical Builders", "Hackathon Participants", "Domain Specialists"],
            "key_pain_points": [
                "Time-consuming setup during 24-48h hackathons",
                "Lack of structured API contract definitions",
                "Difficulty converting raw problem ideas into clean technical specs"
            ],
            "competitive_landscape": "Existing solutions focus on basic static templates rather than dynamic autonomous multi-agent synthesis.",
            "feasibility_score": 94
        },
        "current_step": "product"
    }

def product_node(state: ProjectState) -> dict:
    """Product Agent Node: Invokes LLM to generate product features and user stories."""
    problem = state.get("problem_statement", "")
    research = state.get("research_data", {})
    llm = _get_llm()

    if llm:
        try:
            print(f"[LangGraph Product Agent] Invoking real LLM product spec synthesis...")
            prompt = f"""
            You are a Senior Technical Product Manager. Generate a Product Specification based on:
            Problem Statement: {problem}
            Research Analysis: {json.dumps(research)}
            
            Respond strictly with a valid JSON object matching this schema:
            {{
                "project_name": "Catchy Project Title",
                "mvp_features": [
                    {{"name": "Feature 1", "description": "Details", "priority": "MVP"}},
                    {{"name": "Feature 2", "description": "Details", "priority": "MVP"}}
                ],
                "phase2_features": [
                    {{"name": "Future Feature", "description": "Details", "priority": "Future"}}
                ],
                "user_stories": [
                    "As a [user], I want to [action] so that [value]."
                ],
                "ux_workflow": [
                    "Step 1: User lands on dashboard and inputs criteria",
                    "Step 2: AI engine processes request"
                ]
            }}
            """
            from langchain_core.messages import SystemMessage, HumanMessage
            response = llm.invoke([
                SystemMessage(content="You return strictly valid JSON matching the requested schema."),
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
            print(f"[Product Agent] LLM execution error: {e}")

    # Fallback
    return {
        "product_spec": {
            "project_name": f"{research.get('domain_category', 'AI Platform').split()[0]} Forge AI",
            "mvp_features": [
                {"name": "Problem Statement Parser", "description": "Interactive input interface with preset idea buttons.", "priority": "MVP"},
                {"name": "LangGraph Stateful Agent Engine", "description": "Multi-agent graph running Orchestrator -> Research -> Product -> Architecture.", "priority": "MVP"},
                {"name": "Interactive Blueprint Display & Exporter", "description": "UI dashboard rendering database schemas, API specs, and Markdown export.", "priority": "MVP"}
            ],
            "phase2_features": [
                {"name": "Automated Repository Scaffolder", "description": "Auto-generates starter GitHub repository code.", "priority": "Future"}
            ],
            "user_stories": [
                "As a developer, I want to input my hackathon problem statement to get a complete technical architecture spec.",
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
    """Architecture Agent Node: Invokes LLM to design system components, DB schema, and APIs."""
    problem = state.get("problem_statement", "")
    research = state.get("research_data", {})
    product = state.get("product_spec", {})
    llm = _get_llm()

    if llm:
        try:
            print(f"[LangGraph Architecture Agent] Invoking real LLM system architecture design...")
            prompt = f"""
            You are a Principal Software Architect. Design a production-ready system architecture for:
            Problem: {problem}
            Research: {json.dumps(research)}
            Product Spec: {json.dumps(product)}
            
            Respond strictly with a valid JSON object matching this schema:
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
                    {{"method": "POST", "path": "/api/resource", "description": "Endpoint details", "request_body": "{{}}", "response_body": "{{}}"}}
                ]
            }}
            """
            from langchain_core.messages import SystemMessage, HumanMessage
            response = llm.invoke([
                SystemMessage(content="You return strictly valid JSON matching the requested schema."),
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
            print(f"[Architecture Agent] LLM execution error: {e}")

    # Fallback
    return {
        "architecture_spec": {
            "recommended_tech_stack": {
                "frontend": "Next.js 14 (App Router), TypeScript, Tailwind CSS",
                "backend": "Python, FastAPI, Pydantic v2, SQLAlchemy",
                "agent_framework": "LangGraph, LangChain, OpenAI / Gemini",
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
    """Builds and compiles the LangGraph StateGraph workflow."""
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

# Global compiled graph instance
project_graph = create_project_graph()

def run_project_workflow(problem_statement: str) -> dict:
    """Executes the multi-agent graph workflow synchronously."""
    initial_state: ProjectState = {
        "problem_statement": problem_statement,
        "research_data": {},
        "product_spec": {},
        "architecture_spec": {},
        "current_step": "started"
    }
    return project_graph.invoke(initial_state)
