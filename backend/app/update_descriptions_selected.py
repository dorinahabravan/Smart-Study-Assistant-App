import os
from backend.app.database import SessionLocal
from backend.app.models.init import Topics
from backend.app.utils.generate_description_openai import generate_description

# Start DB session
db = SessionLocal()

# Specify which subtopics to update
topics_to_update = {
    "Java Developer": ["Java Basics"],
    "Frontend Developer": ["JavaScript Basics"],
    "React Developer": ["React State and Props"],
    "Backend Developer": ["Databases (SQL & NoSQL)"]
}

print(f"🎯 Targeting {sum(len(v) for v in topics_to_update.values())} subtopics...\n")

for course, subtopics in topics_to_update.items():
    for subtopic_title in subtopics:
        topic = db.query(Topics).filter(Topics.title == subtopic_title).first()

        if not topic:
            print(f"❌ Subtopic not found: {subtopic_title}")
            continue

        print(f"📝 Generating description for: {subtopic_title} (from {course})")

        prompt = (
            f"Explain the topic '{subtopic_title}' in a structured and beginner-friendly way. "
            "Include what it is, why it matters, basic concepts, and real-world examples. "
            "Write in a clear and educational tone suitable for people new to programming."
        )

        description = generate_description(prompt)

        if description:
            print("📘 Description preview:", description[:100], "...\n")
            topic.description = description
            db.commit()
        else:
            print(f"⚠️ Skipped: {subtopic_title} (no description generated)")

db.close()
print("✅ Selected subtopics updated.")
