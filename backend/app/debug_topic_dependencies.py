# backend/app/debug_topic_dependencies.py
from backend.app.database import SessionLocal
from backend.app.models.init import Topics, TopicDependency
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="./backend/.env")

print("🔍 DB ENV VALUES:")
print("DB_USER:", os.getenv("DB_USER"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
print("DB_HOST:", os.getenv("DB_HOST"))
print("DB_PORT:", os.getenv("DB_PORT"))
print("DB_NAME:", os.getenv("DB_NAME"))

db = SessionLocal()

print("\n📚 Available Courses:")
courses = db.query(Topics).filter(Topics.source == "manual").all()
for c in courses:
    print(f"- ID {c.id}: {c.title}")

print("\n🔍 Now checking dependencies for each course...")
for c in courses:
    dependencies = db.query(TopicDependency).filter(TopicDependency.prerequisite_id == c.id).all()
    if not dependencies:
        print(f"⚠️  {c.title} (ID: {c.id}) has NO subtopics.")
    else:
        print(f"✅ {c.title} (ID: {c.id}) has {len(dependencies)} subtopics.")
