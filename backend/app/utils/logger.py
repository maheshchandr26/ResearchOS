import logging
from pathlib import Path

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)


def get_logger(name: str, filename: str):
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(message)s"
    )

    file_handler = logging.FileHandler(
        LOG_DIR / filename,
        encoding="utf-8",
    )

    file_handler.setFormatter(formatter)

    logger.addHandler(file_handler)

    return logger


backend_logger = get_logger(
    "backend",
    "backend.log",
)

upload_logger = get_logger(
    "upload",
    "upload.log",
)

chat_logger = get_logger(
    "chat",
    "chat.log",
)