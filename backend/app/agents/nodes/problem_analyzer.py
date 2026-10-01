import json
import os
from typing import Dict, Any
from app.agents.state import AgentState
from app.core.config import settings

def _llm_analyze_problem(problem_statement: str, target_audience: str = None) -> Dict[str, Any]:
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
            You are an expert Hackathon Product Strategist. Analyze the following hackathon problem statement:
            
            Problem Statement: {problem_statement}
            Target Audience Context: {target_audience or 'General'}
            
            Respond ONLY with a valid JSON object matching this schema:
            {{
                "core_problem": "Detailed breakdown of the root issue",
                "domain_category": "Domain name (e.g., AI/ML, FinTech, Web3, HealthTech)",
                "target_users": ["Persona 1", "Persona 2"],
                "key_pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"],
                "value_proposition": "Clear compelling solution statement",
                "feasibility_score": 85
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
            print(f"[ProblemAnalyzer] LLM call fallback due to: {e}")

    # Fallback generator if LLM key is absent or call fails
    summary_words = problem_statement.split()[:8]
    headline = " ".join(summary_words) + "..."
    return {
        "core_problem": f"Lack of streamlined, automated tools addressing: '{headline}'. Current manual or legacy methods lack agility, real-time feedback, and automated insights.",
        "domain_category": "AI Automation / Cloud SaaS",
        "target_users": [
            target_audience or "Developers & Tech Enthusiasts",
            "Hackathon Teams & Project Builders",
            "Domain Specialists & End-users"
        ],
        "key_pain_points": [
            "High setup friction and manual workflow overhead",
            "Lack of integrated, intelligent multi-agent automation",
            "Difficulty translating abstract problems into actionable specs in short hackathons"
        ],
        "value_proposition": "An autonomous AI platform that instantly transforms raw problem statements into structured, production-ready product and technical blueprints.",
        "feasibility_score": 92
    }

def analyze_problem_node(state: AgentState) -> Dict[str, Any]:
    print("--- [NODE: PROBLEM ANALYZER] ---")
    problem_statement = state.get("problem_statement", "")
    target_audience = state.get("target_audience")
    
    analysis = _llm_analyze_problem(problem_statement, target_audience)
    
    return {
        "problem_analysis": analysis,
        "current_step": "product_specifier"
    }
