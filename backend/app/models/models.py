from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import func
from datetime import datetime


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: Optional[str] = Field(default=None, index=True)
    is_completed: bool = Field(default=False)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": func.now()})
