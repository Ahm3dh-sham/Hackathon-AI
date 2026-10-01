import sys
import io

# Force UTF-8 encoding for standard output/error on Windows to prevent charmap encoding errors
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.agents.graph import run_project_workflow
from app.agents.state import ProjectState

app = FastAPI(
    title="HackForge AI Backend API",
    version="1.0.0",
    description="Multi-Agent AI Platform for Hackathon Project Blueprints"
)

# CORS Middleware allowing localhost:3000 and 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    problem_statement: str = Field(..., description="The hackathon problem statement to process.")

@app.get("/")
def root():
    return {"status": "online", "message": "HackForge AI API Server Running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/generate", response_model=ProjectState, status_code=status.HTTP_200_OK)
def generate_blueprint(payload: GenerateRequest):
    """
    POST endpoint accepting a problem statement and triggering the 
    LangGraph Multi-Agent execution pipeline (Orchestrator -> Research -> Product -> Architecture).
    """
    if not payload.problem_statement or not payload.problem_statement.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Problem statement cannot be empty."
        )

    try:
        safe_statement = payload.problem_statement.encode('utf-8', errors='replace').decode('utf-8')
        print(f"[API] Generating blueprint for problem: {safe_statement[:50]}...")
        final_state = run_project_workflow(safe_statement)
        return final_state
    except Exception as e:
        safe_error = str(e).encode('utf-8', errors='replace').decode('utf-8')
        print(f"[API Error] Failed to generate blueprint: {safe_error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate blueprint: {safe_error}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
