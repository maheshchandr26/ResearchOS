from sqlalchemy.orm import Session

from app.models.chat_session import ChatSession
from app.models.chat_message import ChatMessage


class ChatSessionService:

    @staticmethod
    def get_or_create_session(
        db: Session,
        project_id: int,
    ) -> ChatSession:

        session = (
            db.query(ChatSession)
            .filter(ChatSession.project_id == project_id)
            .order_by(ChatSession.id.asc())
            .first()
        )

        if session:
            return session

        session = ChatSession(
            project_id=project_id,
            title="Default Chat",
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        return session

    @staticmethod
    def add_message(
        db: Session,
        session_id: int,
        role: str,
        content: str,
    ):

        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
        )

        db.add(message)
        db.commit()

    @staticmethod
    def get_recent_messages(
        db: Session,
        session_id: int,
        limit: int = 10,
    ):

        return (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(limit)
            .all()
        )