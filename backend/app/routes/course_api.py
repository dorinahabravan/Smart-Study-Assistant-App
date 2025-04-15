# routes/course_api.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.init import Topics, TopicDependency
import json

router = APIRouter()

@router.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Topics).filter(Topics.source == "manual").all()
    result = []

    for course in courses:
        subtopic_ids = db.query(TopicDependency.topic_id).filter(
            TopicDependency.prerequisite_id == course.id
        ).all()
        
        # Extract topic_ids from subtopic_ids (which is a list of tuples)
        subtopic_ids = [tid[0] for tid in subtopic_ids]

        subtopics = db.query(Topics).filter(Topics.id.in_(subtopic_ids)).all()

        result.append({
            "title": course.title,
            "subtopics": [
                {
                    "title": sub.title,
                    "resources": json.loads(sub.resources or "[]")
                } for sub in subtopics
            ]
        })

    return result