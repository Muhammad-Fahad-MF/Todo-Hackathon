from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.models.models import User
from app.db.session import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class CurrentUser(BaseModel):
    id: str
    email: str

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_session)) -> CurrentUser:
    """
    Decodes the JWT, queries the database for the user,
    and handles exceptions for invalid tokens.
    """
    try:
        # better-auth jwt plugin uses the secret to sign. Default alg is HS256.
        payload = jwt.decode(token, settings.BETTER_AUTH_SECRET, algorithms=["HS256"])
        
        # specific to better-auth: user_id might be in 'sub' or 'id'
        user_id: str = payload.get("sub") or payload.get("id")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials: No user ID found in token",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        user = await db.get(User, user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return CurrentUser(id=user.id, email=user.email)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
