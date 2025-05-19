# In quizzes.py or routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.init import Quizzes

router = APIRouter()

@router.get("/api/quizzes/{topic_id}")
def get_quizzes(topic_id: int, db: Session = Depends(get_db)):
    quizzes = db.query(Quizzes).filter(Quizzes.topic_id == topic_id).all()
    return [
        {
            "id": q.id,
            "question": q.question,
            "options": {
                "a": q.option_a,
                "b": q.option_b,
                "c": q.option_c,
                "d": q.option_d,
            },
            "correct_answer": q.correct_answer
        } for q in quizzes
    ]
