from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str
    VERSION: str
    DEBUG: bool = False
    API_V1_PREFIX: str

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str

    # AI
    DEFAULT_LLM: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()