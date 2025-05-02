import os
from backend.app.database import SessionLocal
from backend.app.models.init import Topics
from backend.app.utils.generate_description_openai import generate_description  # ✅ your OpenRouter function

# Load DB session
db = SessionLocal()

print("🔍 DB ENV VALUES:")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {os.getenv('DB_PASSWORD')}")
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_PORT: {os.getenv('DB_PORT')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"🔐 Loaded OpenRouter key: {os.getenv('OPENROUTER_API_KEY')}")

topics = db.query(Topics).all()

for topic in topics:
    print(f"📝 Updating: {topic.title}")

    prompt = (
        f"Explain the topic '{topic.title}' in a structured and beginner-friendly way. "
        "Include what it is, why it matters, basic concepts, and real-world examples. "
        "Write in a clear and educational tone suitable for people new to programming."
    )

    description = generate_description(prompt)

    if description:
        print("📘 New Description (preview):", description[:100], "...\n")
        topic.description = description
        db.commit()
    else:
        print(f"⚠️ Skipped: {topic.title} (no description generated)")

db.close()
print("✅ All descriptions updated.")
