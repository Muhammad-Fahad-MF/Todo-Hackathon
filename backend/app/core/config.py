from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    ALEMBIC_DATABASE_URL: str
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    BETTER_AUTH_SECRET: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
