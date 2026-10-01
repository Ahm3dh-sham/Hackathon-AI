import json
import os
from typing import Dict, Any
from app.agents.state import AgentState
from app.core.config import settings

def _llm_generate_product_spec(problem_statement: str, problem_analysis: Dict[str, Any]) -> Dict[str, Any]:
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
    
    if api_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain_core.messages import SystemMessage, HumanMessage
            
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=api_key,
                temperature=0.3
            )
            
            prompt = f"""
            You are a Senior Product Manager specializing in Hackathon MVPs.
            Based on this Problem Analysis:
            {json.dumps(problem_analysis, indent=2)}
            
            And Original Problem Statement:
            {problem_statement}
            
            Generate a concise, high-impact Product Specification JSON with this schema:
            {{
                "mvp_features": [
                    {{"name": "Feature 1", "description": "Details", "priority": "MVP"}},
                    {{"name": "Feature 2", "description": "Details", "priority": "MVP"}}
                ],
                "phase2_features": [
                    {{"name": "Feature 3", "description": "Post-hackathon scale feature", "priority": "Future"}}
                ],
                "user_stories": [
                    "As a [user], I want to [action] so that [benefit]."
                ],
                "ux_workflow": [
                    "Step 1: User lands on dashboard and inputs parameters",
                    "Step 2: AI engine processes input in parallel"
                ],
                "competitive_advantage": "Why this hackathon submission stands out"
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
            print(f"[ProductSpecifier] LLM call fallback due to: {e}")

    # Fallback generator
    return {
        "mvp_features": [
            {
                "name": "Problem Statement Parser & Input Interface",
                "description": "Interactive, real-time input portal with customizable domain parameters and quick presets.",
                "priority": "MVP"
            },
            {
                "name": "Autonomous Multi-Agent Workflow Engine",
                "description": "LangGraph-powered multi-agent pipeline executing problem analysis, product spec generation, and architecture design.",
                "priority": "MVP"
            },
            {
                "name": "Interactive Blueprint Visualizer & Exporter",
                "description": "Rich structured display of specs, system architecture, database schema, and one-click Markdown/JSON download.",
                "priority": "MVP"
            }
        ],
        "phase2_features": [
            {
                "name": "Automated Code Repository Scaffolding",
                "description": "One-click generation of starter boilerplate GitHub repos pre-configured with Docker and GitHub Actions.",
                "priority": "Future"
            },
            {
                "name": "Live Team Collaboration Workspace",
                "description": "Multi-user real-time editing and agent feedback loop during hackathons.",
                "priority": "Future"
            }
        ],
        "user_stories": [
            "As a hackathon participant, I want to input my project idea and get an instant structured technical architecture so that my team can start coding without delay.",
            "As a judge or mentor, I want to review the complete feature roadmap and database schema to verify the project's feasibility.",
            "As a developer, I want to export the generated project blueprint into Markdown to populate my repository README.md."
        ],
        "ux_workflow": [
            "1. User pastes hackathon problem statement into HackForge AI input form.",
            "2. LangGraph multi-agent orchestrator triggers problem analyzer, product specifier, and technical architect nodes in sequence.",
            "3. Live progress status updates on UI as each agent node completes its phase.",
            "4. Comprehensive interactive project blueprint renders on dashboard.",
            "5. User reviews, copies code/API definitions, or exports full blueprint file."
        ],
        "competitive_advantage": "Eliminates hours of initial planning overhead during time-critical 24-48h hackathons by providing an autonomous, multi-agent AI co-architect."
    }

def generate_product_spec_node(state: AgentState) -> Dict[str, Any]:
    print("--- [NODE: PRODUCT SPECIFIER] ---")
    problem_statement = state.get("problem_statement", "")
    problem_analysis = state.get("problem_analysis", {})
    
    product_spec = _llm_generate_product_spec(problem_statement, problem_analysis)
    
    return {
        "product_spec": product_spec,
        "current_step": "architect"
    }
