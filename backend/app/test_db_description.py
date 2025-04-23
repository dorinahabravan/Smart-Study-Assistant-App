import os
from backend.app.database import SessionLocal
from backend.app.models.init import Topics

db = SessionLocal()

topic = db.query(Topics).filter(Topics.title == "Python Basics").first()

if topic:
    print("📘 Description from DB:\n")
    print(topic.description)
else:
    print("❌ Topic not found.")
