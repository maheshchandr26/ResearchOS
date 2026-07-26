from pydantic import BaseModel


class ChatRequest(BaseModel):
    project_id: int
    question: str


class Source(BaseModel):
    paper_id: int
    paper_name: str
    page: int
    evidence: str
    highlight_text: str
    confidence: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]