import asyncio
from app.db.session import SessionLocal
from app.models.models import User, Task
from sqlmodel import select


async def seed_data():
    async with SessionLocal() as session:
        # Check if users already exist
        result = await session.execute(select(User))
        if result.scalars().first() is None:
            # Create users
            user1 = User(email="test1@example.com", hashed_password="password1")
            user2 = User(email="test2@example.com", hashed_password="password2")
            session.add(user1)
            session.add(user2)
            await session.commit()
            await session.refresh(user1)
            await session.refresh(user2)

            # Create tasks
            task1 = Task(title="Task 1", description="Description 1", user_id=user1.id)
            task2 = Task(title="Task 2", description="Description 2", user_id=user1.id)
            task3 = Task(title="Task 3", description="Description 3", user_id=user2.id)
            session.add(task1)
            session.add(task2)
            session.add(task3)
            await session.commit()
            print("Database seeded with test data.")
        else:
            print("Database already seeded.")


if __name__ == "__main__":
    asyncio.run(seed_data())
