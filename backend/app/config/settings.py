from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central configuration for the application.
    Every configurable value should be defined here.
    """

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
        env_file=".env",
        case_sensitive=True,
    )


@lru_cache
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.
    """
    return Settings()


settings = get_settings()