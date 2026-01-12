from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Determine if we need SSL (required for Neon/Production, typically not for local)
connect_args = {}
if "localhost" not in settings.DATABASE_URL and "127.0.0.1" not in settings.DATABASE_URL:
    connect_args["ssl"] = "require"

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.ECHO_SQL,
    future=True,
    connect_args=connect_args
)

SessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session
