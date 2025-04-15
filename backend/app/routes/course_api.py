# routes/course_api.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.init import Topics, TopicDependency
import json

router = APIRouter()

@router.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Topics).filter(Topics.source == "course").all()
    result = []

    for course in courses:
        # subtopics are linked by TopicDependency
        dependencies = db.query(TopicDependency).filter(TopicDependency.prerequisite_id == course.id).all()
        subtopics = [db.query(Topics).get(dep.topic_id) for dep in dependencies]

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