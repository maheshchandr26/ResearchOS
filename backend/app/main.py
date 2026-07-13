from fastapi import FastAPI

from app.config.settings import settings
from app.core.logger import logger
from sqlalchemy import text

from app.database.session import engine
from app.api.projects import router as project_router
from app.api.papers import router as paper_router
from app.api.chat import router as chat_router
from app.utils.logger import backend_logger
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)
from app.api.health import router as health_router
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)
app.include_router(chat_router)
app.include_router(paper_router)
app.include_router(project_router)
app.add_exception_handler(
    StarletteHTTPException,
    http_exception_handler,
)
app.include_router(health_router)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler,
)

app.add_exception_handler(
    Exception,
    unhandled_exception_handler,
)
@app.on_event("startup")
async def startup_event():
    logger.info(f"{settings.PROJECT_NAME} is starting...")

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database connection successful.")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"{settings.PROJECT_NAME} is shutting down...")


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "application": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }
backend_logger.info(
    "ResearchOS Backend Started"
)