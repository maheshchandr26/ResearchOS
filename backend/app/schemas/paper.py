from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PaperResponse(BaseModel):
    id: int
    project_id: int
    title: str
    filename: str
    file_path: str
    file_size: int
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)