from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.models.database import get_db, BlueprintModel
from app.schemas.pydantic_models import (
    ProblemStatementInput,
    BlueprintResponse,
    ProblemAnalysis,
    ProductSpec,
    TechnicalArchitecture
)
from app.agents.graph import run_blueprint_workflow

router = APIRouter(prefix="/blueprints", tags=["Blueprints"])

@router.post("", response_model=BlueprintResponse, status_code=status.HTTP_201_CREATED)
def create_blueprint(input_data: ProblemStatementInput, db: Session = Depends(get_db)):
    """
    Triggers the autonomous LangGraph multi-agent system to analyze the hackathon problem statement
    and generate a complete project blueprint (Problem Analysis + Product Spec + Tech Architecture).
    """
    try:
        # Run the multi-agent graph
        final_state = run_blueprint_workflow(
            problem_statement=input_data.problem_statement,
            title=input_data.title,
            target_audience=input_data.target_audience,
            tech_preferences=input_data.tech_preferences
        )

        project_title = input_data.title
        if not project_title:
            # Generate title from domain category or default
            analysis = final_state.get("problem_analysis") or {}
            domain = analysis.get("domain_category", "Hackathon")
            words = input_data.problem_statement.split()[:4]
            project_title = f"{domain}: {' '.join(words).title()}"

        # Save to database
        db_blueprint = BlueprintModel(
            id=str(uuid.uuid4()),
            title=project_title,
            problem_statement=input_data.problem_statement,
            problem_analysis=final_state.get("problem_analysis"),
            product_spec=final_state.get("product_spec"),
            technical_architecture=final_state.get("technical_architecture"),
            status="completed"
        )
        db.add(db_blueprint)
        db.commit()
        db.refresh(db_blueprint)

        return db_blueprint

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate blueprint: {str(e)}"
        )

@router.get("", response_model=List[BlueprintResponse])
def list_blueprints(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """
    Retrieves all previously generated hackathon blueprints.
    """
    blueprints = db.query(BlueprintModel).order_by(BlueprintModel.created_at.desc()).offset(skip).limit(limit).all()
    return blueprints

@router.get("/{blueprint_id}", response_model=BlueprintResponse)
def get_blueprint(blueprint_id: str, db: Session = Depends(get_db)):
    """
    Retrieves a single blueprint by its ID.
    """
    blueprint = db.query(BlueprintModel).filter(BlueprintModel.id == blueprint_id).first()
    if not blueprint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blueprint not found.")
    return blueprint

@router.delete("/{blueprint_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blueprint(blueprint_id: str, db: Session = Depends(get_db)):
    """
    Deletes a blueprint record.
    """
    blueprint = db.query(BlueprintModel).filter(BlueprintModel.id == blueprint_id).first()
    if not blueprint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blueprint not found.")
    db.delete(blueprint)
    db.commit()
    return None
