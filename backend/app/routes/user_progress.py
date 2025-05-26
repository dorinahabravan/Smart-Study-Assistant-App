from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.utils.auth import get_current_user
from backend.app.models.init import UserProgress
from backend.app.schemas.user_progress import UserProgressCreate
from datetime import datetime



router = APIRouter()

@router.post("/user-progress/")
def save_user_progress(data: UserProgressCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    progress = db.query(UserProgress).filter_by(user_id=user.id, topic_id=data.topic_id).first()
    
    if progress:
        progress.quiz_score = data.quiz_score
        progress.completed = data.completed
        progress.updated_at = datetime.utcnow()
    else:
        progress = UserProgress(
            user_id=user.id,
            topic_id=data.topic_id,
            quiz_score=data.quiz_score,
            completed=data.completed,
            updated_at=datetime.utcnow()
        )
        db.add(progress)

    db.commit()
    return {"message": "Progress saved", "score": data.quiz_score, "completed": data.completed}



@router.get("/user-progress/")
def get_user_progress(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    progress_data = db.query(UserProgress).filter_by(user_id=user.id).all()
    return [
        {
            "topic_id": item.topic_id,
            "quiz_score": item.quiz_score,
            "completed": item.completed,
            "updated_at": item.updated_at.isoformat()
        }
        for item in progress_data
    ]
