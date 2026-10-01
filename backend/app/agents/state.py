from typing import TypedDict, Dict, Any, Optional

class ProjectState(TypedDict):
    problem_statement: str
    research_data: Dict[str, Any]
    product_spec: Dict[str, Any]
    architecture_spec: Dict[str, Any]
    current_step: str
