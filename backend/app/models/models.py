from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import func
from datetime import datetime


class User(SQLModel, table=True):
    __tablename__ = "user"
    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = Field(default=None)
    image: Optional[str] = Field(default=None)
    emailVerified: bool = Field(default=False)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    # better-auth manages passwords internally, often in 'account' table or hashed here depending on config
    # We'll map what better-auth provides.


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: Optional[str] = Field(default=None, index=True)
    is_completed: bool = Field(default=False)
    user_id: Optional[str] = Field(default=None, foreign_key="user.id")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": func.now()})
