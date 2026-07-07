from fastapi import FastAPI

from app.config.settings import settings
from app.core.logger import logger

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)


@app.on_event("startup")
async def startup_event():
    logger.info(f"{settings.PROJECT_NAME} is starting...")


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