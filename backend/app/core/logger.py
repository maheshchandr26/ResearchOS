from pathlib import Path
import sys

from loguru import logger

# Create logs directory if it doesn't exist
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

# Remove default logger
logger.remove()

# Console logger
logger.add(
    sys.stdout,
    level="INFO",
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
           "<level>{level}</level> | "
           "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
           "<level>{message}</level>",
)

# File logger
logger.add(
    LOG_DIR / "researchos.log",
    rotation="10 MB",
    retention="7 days",
    compression="zip",
    level="INFO",
)

__all__ = ["logger"]