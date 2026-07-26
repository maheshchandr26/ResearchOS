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

    summary: str | None = None
    page_count: int | None = None
    word_count: int | None = None

    model_config = ConfigDict(from_attributes=True)