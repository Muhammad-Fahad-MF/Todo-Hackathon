from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.models import Task
from app.core.auth import get_current_user, CurrentUser
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter()


class TaskCreate(BaseModel):
    title: str
    description: str | None = None


class TaskRead(BaseModel):
    id: int
    title: str
    description: str | None = None
    is_completed: bool


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_completed: bool | None = None


@router.post("/", response_model=TaskRead)
async def create_task(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: CurrentUser = Depends(get_current_user),
    task: TaskCreate,
):
    db_task = Task.model_validate(task, update={"user_id": current_user.id})
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task


@router.get("/", response_model=List[TaskRead])
async def read_tasks(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: CurrentUser = Depends(get_current_user),
):
    result = await session.execute(
        select(Task).where(Task.user_id == current_user.id)
    )
    tasks = result.scalars().all()
    return tasks


@router.get("/{task_id}", response_model=TaskRead)
async def read_task(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: CurrentUser = Depends(get_current_user),
    task_id: int,
):
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: CurrentUser = Depends(get_current_user),
    task_id: int,
    task: TaskUpdate,
):
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    db_task = result.scalars().first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    task_data = task.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task


@router.delete("/{task_id}")
async def delete_task(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: CurrentUser = Depends(get_current_user),
    task_id: int,
):
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await session.delete(task)
    await session.commit()
    return {"ok": True}
