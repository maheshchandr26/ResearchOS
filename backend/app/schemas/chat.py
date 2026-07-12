from pydantic import BaseModel


class ChatRequest(BaseModel):
    project_id: int
    question: str


class Source(BaseModel):
    paper_name: str
    chunk: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]