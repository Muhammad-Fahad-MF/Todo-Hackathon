from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import jwt

from app.core.config import settings
from app.models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class CurrentUser(BaseModel):
    id: int
    email: str

def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    """
    A placeholder dependency to simulate JWT verification and return a CurrentUser.
    In a real application, this would decode the JWT, query the database for the user,
    and handle exceptions for invalid tokens.
    """
    try:
        # This is a placeholder. In a real app, you would use a secret key
        # and verify the token's signature and claims.
        payload = jwt.decode(token, settings.BETTER_AUTH_SECRET, algorithms=["HS256"])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # In a real app, you'd fetch the user from the database here.
        # For this example, we'll return a dummy user based on the token.
        # This assumes the user exists.
        return CurrentUser(id=user_id, email=f"user_{user_id}@example.com")
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
