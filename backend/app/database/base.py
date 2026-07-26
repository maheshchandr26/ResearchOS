from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.project import Project
from app.models.paper import Paper
from app.models.chat_session import ChatSession
from app.models.chat_message import ChatMessage