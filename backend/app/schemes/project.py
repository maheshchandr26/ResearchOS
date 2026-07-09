from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None
    field: str | None = None


class ProjectResponse(ProjectCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)