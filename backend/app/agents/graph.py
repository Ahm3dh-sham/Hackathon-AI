from langgraph.graph import StateGraph, END
from app.agents.state import ProjectState

def orchestrator_node(state: ProjectState) -> dict:
    """Orchestrator Agent Node: Initializes execution and coordinates agents."""
    print("[Agent Node: Orchestrator] Analyzing input and initializing state...")
    return {
        "current_step": "research",
    }

def research_node(state: ProjectState) -> dict:
    """Research Agent Node: Conducts problem analysis and market research."""
    print("[Agent Node: Research] Conducting problem analysis...")
    problem = state.get("problem_statement", "")
    words = problem.split()[:5]
    summary = " ".join(words) + "..."
    
    mock_research = {
        "domain_category": "AI Agents & Developer Tools",
        "core_problem": f"Market analysis indicates high friction in manual workflows related to: '{summary}'. Existing solutions lack real-time autonomous coordination.",
        "target_audience": [
          "Hackathon Builders & Startup Teams",
          "Software Architects & Technical Leads",
          "Enterprise Automation Engineers"
        ],
        "key_pain_points": [
          "Time-consuming manual project planning in 24-48h hackathons",
          "Inconsistent API contract definitions across multi-developer teams",
          "Lack of automated research & technology stack recommendations"
        ],
        "competitive_landscape": "Most tools focus only on static code boilerplate rather than autonomous problem-to-spec blueprint synthesis.",
        "feasibility_score": 92
    }
    
    return {
        "research_data": mock_research,
        "current_step": "product"
    }

def product_node(state: ProjectState) -> dict:
    """Product Agent Node: Synthesizes Product Specification (MVP & Features)."""
    print("[Agent Node: Product] Generating product specification...")
    research = state.get("research_data", {})
    
    mock_product = {
        "project_name": "HackForge AI Platform",
        "mvp_features": [
          {
            "name": "Problem Statement Parser",
            "description": "Interactive UI portal with instant preset selectors to parse hackathon ideas.",
            "priority": "MVP"
          },
          {
            "name": "LangGraph StateGraph Engine",
            "description": "Stateful 4-agent graph orchestrating Orchestrator, Research, Product, and Architecture nodes.",
            "priority": "MVP"
          },
          {
            "name": "Interactive Blueprint Visualizer",
            "description": "Structured card display of specs, database schema, and Markdown export.",
            "priority": "MVP"
          }
        ],
        "phase2_features": [
          {
            "name": "GitHub Repo Scaffolder",
            "description": "Automatically initializes Git repository with generated code templates.",
            "priority": "Future"
          }
        ],
        "user_stories": [
          "As a hackathon participant, I want to input my project idea and get an instant structured technical architecture.",
          "As a developer, I want to view API endpoints and DB schemas so I can start coding immediately.",
          "As a team lead, I want to export the generated blueprint into Markdown for our README."
        ],
        "ux_workflow": [
          "1. User enters problem statement into the input form.",
          "2. LangGraph state graph executes Orchestrator -> Research -> Product -> Architecture agents.",
          "3. Backend returns structured JSON blueprint payload.",
          "4. Frontend displays structured UI cards and enables Markdown export."
        ]
    }
    
    return {
        "product_spec": mock_product,
        "current_step": "architecture"
    }

def architecture_node(state: ProjectState) -> dict:
    """Architecture Agent Node: Designs system architecture, DB schema, and APIs."""
    print("[Agent Node: Architecture] Designing technical architecture...")
    
    mock_architecture = {
        "recommended_tech_stack": {
          "frontend": "Next.js 15 (App Router), TypeScript, Tailwind CSS",
          "backend": "Python, FastAPI, Pydantic, SQLAlchemy",
          "agent_framework": "LangGraph, LangChain, OpenAI / Gemini",
          "database": "PostgreSQL with pgvector extension",
          "deployment": "Vercel (Frontend) + Render / Railway (Backend)"
        },
        "system_components": [
          {
            "name": "Next.js Frontend Portal",
            "role": "Single Page Application for user inputs, live progress, and blueprint rendering.",
            "technologies": ["Next.js", "TypeScript", "Tailwind CSS"]
          },
          {
            "name": "FastAPI API Server",
            "role": "Handles /api/generate REST endpoint and serves as graph runner.",
            "technologies": ["FastAPI", "Uvicorn", "Pydantic"]
          },
          {
            "name": "LangGraph Agent Engine",
            "role": "Stateful directed agent graph executing domain-specific synthesis nodes.",
            "technologies": ["LangGraph", "LangChain Core"]
          }
        ],
        "database_schema": [
          {
            "table_name": "projects",
            "description": "Stores generated hackathon blueprints and agent state history.",
            "columns": [
              "id VARCHAR(36) PRIMARY KEY",
              "problem_statement TEXT NOT NULL",
              "research_data JSONB",
              "product_spec JSONB",
              "architecture_spec JSONB",
              "created_at TIMESTAMP"
            ]
          }
        ],
        "api_endpoints": [
          {
            "method": "POST",
            "path": "/api/generate",
            "description": "Accepts problem_statement payload and returns generated ProjectState blueprint.",
            "request_body": "{ 'problem_statement': 'string' }",
            "response_body": "{ 'problem_statement': '...', 'research_data': {...}, 'product_spec': {...}, 'architecture_spec': {...} }"
          }
        ]
    }
    
    return {
        "architecture_spec": mock_architecture,
        "current_step": "completed"
    }

def create_project_graph():
    """Builds and compiles the LangGraph StateGraph workflow."""
    workflow = StateGraph(ProjectState)

    # Add agent nodes
    workflow.add_node("orchestrator", orchestrator_node)
    workflow.add_node("research", research_node)
    workflow.add_node("product", product_node)
    workflow.add_node("architecture", architecture_node)

    # Entry point and edges
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
