from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from sqlalchemy import Text

class Paper(Base):
    __tablename__ = "papers"

    id: Mapped[int] = mapped_column(primary_key=True)

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE")
    )

    title: Mapped[str] = mapped_column(String(255))

    filename: Mapped[str] = mapped_column(String(255))

    file_path: Mapped[str] = mapped_column(String(500))
    sha256_hash: Mapped[str] = mapped_column(
    String(64),
    nullable=False,
)
    file_size: Mapped[int]

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    project = relationship("Project", back_populates="papers")

    document = relationship(
    "Document",
    back_populates="paper",
    uselist=False,
    cascade="all, delete-orphan",
)
    raw_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
)

    page_count: Mapped[int | None]

    word_count: Mapped[int | None]