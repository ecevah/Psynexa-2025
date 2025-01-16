from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import models
from .database import get_db

# JWT Configuration
SECRET_KEY = "1092574ac328290311b25f117919cc3f1828f421e2b5abbbd9b66858c8ca19f4d2c4a1646f88e4647fbae95d70f29fa04d2470d35e9bd746d79314eec66b5736d5518c1b646bf943aaf323fbfefdc97a24ccb30028f855fd1090d37690bda1e99e781cd7b9225a82d5568acf10910b27fed490eb2cce5a58919645de770169563c308af3f24e478ec6c977f41dc9c4a7efb6b347af5f8aa1ffe35dafb4e7c60949820546d98c6625cb1beb45e0531c4fde643ced273679e552ffb42b4df433ee1c5239e1350d8237060a236451561c33f5d7301a0a4e355e12b1d341bf57eda51de9a92aae55dd87a5fd75a214d2e7982b740c32fba71d8ee9b3a23b370e22a3"  # Change this to a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user 

async def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        
        # Get database session
        db = next(get_db())
        try:
            user = db.query(models.User).filter(models.User.username == username).first()
            return user
        finally:
            db.close()
            
    except JWTError:
        return None

# fast-api-backend/app/routers/auth.py