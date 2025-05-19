# routes/course_api.py
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.init import Topics, TopicDependency


router = APIRouter()

@router.get("/api/courses/{course_id}")
def get_course_by_id(course_id: int, db: Session = Depends(get_db)):
    # Get the course
    course = db.query(Topics).filter(Topics.id == course_id).first()
    if not course:
        return {"detail": "Course not found"}, 404

    # Get its subtopics based on TopicDependency
    links = db.query(TopicDependency).filter(TopicDependency.prerequisite_id == course.id).all()

    subtopics = []
    for link in links:
        sub = db.query(Topics).filter(Topics.id == link.topic_id).first()
        if sub:
            subtopics.append({
                "id": sub.id,  # ✅ ADD THIS LINE
                "title": sub.title,
                "description": sub.description,
                "resources": json.loads(sub.resources or "[]")
            })

    return {
        "id": course.id,
        "title": course.title,
        "subtopics": subtopics
    }


@router.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    print("✅ /api/courses endpoint called")

    # Get all topic IDs that are used as subtopics
    subtopic_ids = [row[0] for row in db.query(TopicDependency.topic_id).distinct().all()]

    # Get only top-level courses (not subtopics)
    courses = db.query(Topics).filter(~Topics.id.in_(subtopic_ids)).all()

    result = []

    for course in courses:
        # Get the subtopics where this course is the prerequisite
        links = db.query(TopicDependency).filter(TopicDependency.prerequisite_id == course.id).all()
        subtopics = []

        for link in links:
            sub = db.query(Topics).filter(Topics.id == link.topic_id).first()
            if sub:
                subtopics.append({
                    "title": sub.title,
                    "description": sub.description,
                    "resources": json.loads(sub.resources or "[]")
                })

        result.append({
            "id": course.id,
            "title": course.title,
            "subtopics": subtopics
        })

    return result