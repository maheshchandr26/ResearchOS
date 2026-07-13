from fastapi import APIRouter
from sqlalchemy import text

from app.database.session import SessionLocal
from app.ai.vector_store import VectorStore

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("/")
def health_check():

    services = {}

    # PostgreSQL
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        services["database"] = "connected"
        db.close()

    except Exception:
        services["database"] = "disconnected"

    # ChromaDB
    try:
        store = VectorStore()
        store.collection.count()

        services["vector_store"] = "connected"

    except Exception:
        services["vector_store"] = "disconnected"

    # Ollama
    try:
        import ollama

        ollama.list()

        services["ollama"] = "running"

    except Exception:
        services["ollama"] = "stopped"

    status = (
        "healthy"
        if all(
            value in ["connected", "running"]
            for value in services.values()
        )
        else "degraded"
    )

    return {
        "status": status,
        "services": services,
        "version": "1.0.0",
    }