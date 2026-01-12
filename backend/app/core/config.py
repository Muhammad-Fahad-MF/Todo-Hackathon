from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = Field(...)
    ALEMBIC_DATABASE_URL: str = Field(...)
    CORS_ORIGINS: list[str] = Field(...)
    BETTER_AUTH_SECRET: str = Field(...)
    ECHO_SQL: bool = False

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
