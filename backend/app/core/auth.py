from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from datetime import datetime
from app.models.models import User, Session
from app.db.session import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class CurrentUser(BaseModel):
    id: str
    email: str

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_session)) -> CurrentUser:
    """
    Validates the opaque session token by querying the database.
    """
    try:
        print(f"DEBUG: Verifying Session Token: {token}")
        
        # 1. Lookup session in DB
        statement = select(Session).where(Session.token == token)
        result = await db.execute(statement)
        session_record = result.scalar_one_or_none()
        
        if not session_record:
            print("DEBUG: Session not found in DB")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 2. Check expiration
        # datetime.utcnow() is naive, ensuring compatibility with naive DB timestamps
        if session_record.expiresAt < datetime.utcnow():
            print(f"DEBUG: Session expired at {session_record.expiresAt}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 3. Get User
        user = await db.get(User, session_record.userId)
        if user is None:
            print("DEBUG: Associated user not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return CurrentUser(id=user.id, email=user.email)

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"DEBUG: Auth Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
