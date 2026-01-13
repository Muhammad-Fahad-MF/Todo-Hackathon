import asyncio
from app.core.config import settings
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def reset_db():
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        # Disable foreign key checks to avoid ordering issues (Postgres specific)
        await conn.execute(text("DROP SCHEMA public CASCADE;"))
        await conn.execute(text("CREATE SCHEMA public;"))
        await conn.execute(text("GRANT ALL ON SCHEMA public TO public;")) # Restore default permissions
        # OR just drop specific tables if schema drop is too aggressive
        # await conn.execute(text("DROP TABLE IF EXISTS task CASCADE"))
        # await conn.execute(text("DROP TABLE IF EXISTS \"user\" CASCADE")) # user is keyword
        # await conn.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE"))
    
    await engine.dispose()
    print("Database reset complete.")

if __name__ == "__main__":
    asyncio.run(reset_db())
