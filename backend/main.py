from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from app.agents.graph import run_project_workflow
from app.agents.state import ProjectState

app = FastAPI(
    title="HackForge AI Backend API",
    version="1.0.0",
    description="Multi-Agent AI Platform for Hackathon Project Blueprints"
)

# CORS Middleware allowing localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    problem_statement: str = Field(..., description="The hackathon problem statement to process.")

@app.get("/")
def root():
    return {"status": "online", "message": "HackForge AI API Server Running"}

@app.post("/api/generate", response_model=ProjectState, status_code=status.HTTP_200_OK)
def generate_blueprint(payload: GenerateRequest):
    """
    POST endpoint accepting a problem statement and triggering the 
    LangGraph Multi-Agent execution pipeline (Orchestrator -> Research -> Product -> Architecture).
    """
    if not payload.problem_statement.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Problem statement cannot be empty."
        )

    try:
        print(f"[API] Generating blueprint for problem: {payload.problem_statement[:50]}...")
        final_state = run_project_workflow(payload.problem_statement)
        return final_state
    except Exception as e:
        print(f"[API Error] Failed to generate blueprint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate blueprint: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
