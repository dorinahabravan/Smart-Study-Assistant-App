from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app.models.init import User
from backend.app.utils.auth import get_current_user
from backend.app.utils.auth import create_access_token, get_password_hash, verify_password
from pydantic import BaseModel
from backend.app.schemas.user import UserCreate



router = APIRouter()


class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/api/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)

    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/api/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer",  "username": db_user.username }


@router.get("/api/protected-subtopics")
def get_subtopics(user: User = Depends(get_current_user)):
    return {"message": f"Hello, {user.username}! This is protected data."}
