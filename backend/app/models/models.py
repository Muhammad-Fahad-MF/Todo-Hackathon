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

class Session(SQLModel, table=True):
    __tablename__ = "session"
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id", index=True)
    token: str = Field(unique=True, index=True)
    expiresAt: datetime
    ipAddress: Optional[str] = Field(default=None)
    userAgent: Optional[str] = Field(default=None)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class Account(SQLModel, table=True):
    __tablename__ = "account"
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id", index=True)
    accountId: str
    providerId: str
    accessToken: Optional[str] = Field(default=None)
    refreshToken: Optional[str] = Field(default=None)
    accessTokenExpiresAt: Optional[datetime] = Field(default=None)
    refreshTokenExpiresAt: Optional[datetime] = Field(default=None)
    scope: Optional[str] = Field(default=None)
    password: Optional[str] = Field(default=None)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class Verification(SQLModel, table=True):
    __tablename__ = "verification"
    id: str = Field(primary_key=True)
    identifier: str = Field(index=True)
    value: str
    expiresAt: datetime
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: Optional[str] = Field(default=None, index=True)
    is_completed: bool = Field(default=False)
    user_id: Optional[str] = Field(default=None, foreign_key="user.id")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": func.now()})
