import os
import requests
from backend.app.database import SessionLocal
from backend.app.models.init import Topics, Quizzes
from backend.app.utils.generate_description_openai import generate_description

# Load DB session
db = SessionLocal()

print("\U0001F50D DB ENV VALUES:")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {os.getenv('DB_PASSWORD')}")
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_PORT: {os.getenv('DB_PORT')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")

print(f"\U0001F512 Loaded OpenRouter key: {os.getenv('OPENROUTER_API_KEY')}")

def generate_quiz_from_topic(topic_title: str) -> list:
    api_key = os.getenv("OPENROUTER_API_KEY")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    prompt = (
        f"Generate a multiple choice quiz (5 questions) about the topic '{topic_title}'. "
        "Respond only in raw JSON as a list of objects with this format:\n"
        "[{\"question\": \"...\", \"correct_answer\": \"...\", \"option_a\": \"...\", \"option_b\": \"...\", \"option_c\": \"...\", \"option_d\": \"...\"}]."
    )

    data = {
        "model": "mistralai/mistral-7b-instruct",  # ✅ Update to working free model if needed
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )
        print(f"📨 Status Code: {response.status_code}")
        print(f"🧾 Raw Response: {response.text[:200]}...")  # Limit to first 200 chars

        response.raise_for_status()
        raw = response.json()["choices"][0]["message"]["content"]

        quiz_data = json.loads(raw)  # May fail here if model didn't respond with valid JSON
        return quiz_data
    except Exception as e:
        print(f"❌ OpenRouter API error: {e}")
        return None

def generate_quiz_questions(topic_title):
    prompt = (
        f"Generate a beginner-friendly multiple-choice quiz (4 options) for the topic: '{topic_title}'. "
        "Return 1 question with the correct answer and 3 plausible incorrect options. "
        "Format response as JSON like: {'question': '...', 'correct_answer': '...', 'options': ['A', 'B', 'C', 'D']}"
    )
    return generate_description(prompt)

# Query all topics
topics = db.query(Topics).all()

for topic in topics:
    print(f"\U0001F4DA Generating quiz for: {topic.title}")

    quiz_json = generate_quiz_questions(topic.title)

    if not quiz_json:
        print(f"⚠️ Skipped quiz for '{topic.title}'")
        continue

    try:
        # Convert string to dictionary if needed
        import json
        quiz = json.loads(quiz_json.strip()) if isinstance(quiz_json, str) else quiz_json

        new_quiz = Quizzes(
            topic_id=topic.id,
            question=quiz['question'],
            correct_answer=quiz['correct_answer'],
            option_a=quiz['options'][0],
            option_b=quiz['options'][1],
            option_c=quiz['options'][2],
            option_d=quiz['options'][3],
        )
        db.add(new_quiz)
        db.commit()
        print("✅ Quiz added for:", topic.title)

    except Exception as e:
        print(f"❌ Error parsing quiz for {topic.title}:", e)


db.close()
print("🎉 All quizzes generated.")
