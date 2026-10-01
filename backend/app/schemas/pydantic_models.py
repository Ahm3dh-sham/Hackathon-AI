from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Input Schema
class ProblemStatementInput(BaseModel):
    problem_statement: str = Field(..., description="The hackathon problem statement or idea description.")
    title: Optional[str] = Field(None, description="Optional custom title for the hackathon project.")
    target_audience: Optional[str] = Field(None, description="Target user persona or market sector.")
    tech_preferences: Optional[List[str]] = Field(default=[], description="Preferred frameworks or languages (e.g., Python, Next.js, PyTorch).")

# Structured Agent Output Schemas
class ProblemAnalysis(BaseModel):
    core_problem: str = Field(..., description="Root problem description.")
    domain_category: str = Field(..., description="Industry domain (e.g., FinTech, HealthTech, Developer Tools).")
    target_users: List[str] = Field(..., description="Primary user personas and target audience.")
    key_pain_points: List[str] = Field(..., description="Major pain points addressed.")
    value_proposition: str = Field(..., description="Unique value prop and core innovation.")
    feasibility_score: int = Field(..., description="Hackathon feasibility score out of 100.")

class FeatureItem(BaseModel):
    name: str = Field(..., description="Feature name.")
    description: str = Field(..., description="Feature breakdown.")
    priority: str = Field("MVP", description="MVP, High, Medium, or Future.")

class ProductSpec(BaseModel):
    mvp_features: List[FeatureItem] = Field(..., description="Core features for the 24-48h hackathon MVP.")
    phase2_features: List[FeatureItem] = Field(..., description="Post-hackathon enhancement features.")
    user_stories: List[str] = Field(..., description="Key user journey stories.")
    ux_workflow: List[str] = Field(..., description="Step-by-step user flow.")
    competitive_advantage: str = Field(..., description="Why this solution wins.")

class SystemComponent(BaseModel):
    name: str = Field(..., description="Component name (e.g., Auth Service, Vector Engine).")
    role: str = Field(..., description="Function within system.")
    technologies: List[str] = Field(..., description="Tech used in component.")

class DatabaseTable(BaseModel):
    table_name: str = Field(..., description="Database table name.")
    description: str = Field(..., description="Table purpose.")
    columns: List[str] = Field(..., description="Columns list with types.")

class APIEndpoint(BaseModel):
    method: str = Field(..., description="HTTP Method (GET, POST, etc).")
    path: str = Field(..., description="Endpoint path.")
    description: str = Field(..., description="Endpoint purpose.")
    request_body: Optional[str] = Field(None, description="Request schema.")
    response_body: Optional[str] = Field(None, description="Response schema.")

class TechnicalArchitecture(BaseModel):
    recommended_tech_stack: Dict[str, str] = Field(..., description="Frontend, Backend, DB, AI, Infra breakdown.")
    system_components: List[SystemComponent] = Field(..., description="Architectural components.")
    database_schema: List[DatabaseTable] = Field(..., description="Database tables schema design.")
    api_endpoints: List[APIEndpoint] = Field(..., description="REST API endpoint definitions.")
    deployment_strategy: str = Field(..., description="Hosting and deployment strategy for hackathon.")

# Blueprint Output Response Schema
class BlueprintResponse(BaseModel):
    id: str
    title: str
    problem_statement: str
    problem_analysis: Optional[ProblemAnalysis] = None
    product_spec: Optional[ProductSpec] = None
    technical_architecture: Optional[TechnicalArchitecture] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
