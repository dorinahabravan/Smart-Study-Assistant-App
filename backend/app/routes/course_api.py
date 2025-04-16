# routes/course_api.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.init import Topics, TopicDependency
import json

router = APIRouter()

@router.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    # Get only topics that are NOT in the topic_id column (i.e., they're not subtopics)
    subtopic_ids = db.query(TopicDependency.topic_id).distinct()
    courses = db.query(Topics).filter(~Topics.id.in_(subtopic_ids)).all()

    result = []

    for course in courses:
        # Get subtopics linked to this course
        subtopic_links = db.query(TopicDependency.topic_id).filter(
            TopicDependency.prerequisite_id == course.id
        ).all()
        
        subtopic_ids = [t[0] for t in subtopic_links]
        subtopics = db.query(Topics).filter(Topics.id.in_(subtopic_ids)).all()

        result.append({
            "title": course.title,
            "subtopics": [
                {
                    "title": sub.title,
            "description": sub.description,
            "resources": json.loads(sub.resources or "[]")
    } for sub in subtopics
            ]
        })

    return result
