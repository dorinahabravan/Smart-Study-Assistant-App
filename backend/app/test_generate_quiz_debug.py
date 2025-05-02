import os
import json
import requests
import re
import time
from backend.app.database import SessionLocal
from backend.app.models.init import Topics, Quizzes
from dotenv import load_dotenv
from sqlalchemy.sql import exists
from sqlalchemy import or_

load_dotenv()

def extract_json(text):
    try:
        match = re.search(r"\[.*\]", text, re.DOTALL)
        if not match:
            match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            raw = json.loads(match.group(0))

            normalized = []
            for item in raw:
                if "options" in item and isinstance(item["options"], dict):
                    options = item["options"]
                    normalized.append({
                        "question": item.get("question"),
                        "correct_answer": item.get("correct_answer"),
                        "option_a": options.get("a"),
                        "option_b": options.get("b"),
                        "option_c": options.get("c"),
                        "option_d": options.get("d"),
                    })
                elif "options" in item and isinstance(item["options"], list):
                    opts = item["options"]
                    normalized.append({
                        "question": item.get("question"),
                        "correct_answer": item.get("correct_answer"),
                        "option_a": opts[0] if len(opts) > 0 else None,
                        "option_b": opts[1] if len(opts) > 1 else None,
                        "option_c": opts[2] if len(opts) > 2 else None,
                        "option_d": opts[3] if len(opts) > 3 else None,
                    })
                else:
                    normalized.append(item)
            return normalized
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON decode error: {e}")
    return None

def generate_quiz(prompt):
    api_key = os.getenv("OPENROUTER_API_KEY")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        print(f"🔁 Status Code: {response.status_code}")
        print("🧾 Raw Text Response:\n", response.text)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

# DB session
db = SessionLocal()
print("🔍 DB ENV VALUES:")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {os.getenv('DB_PASSWORD')}")
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_PORT: {os.getenv('DB_PORT')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"🔒 Loaded OpenRouter key: {os.getenv('OPENROUTER_API_KEY')}")

topics = db.query(Topics).all()

for topic in topics:
    # Temporarily disabled skipping logic to force regeneration
    # incomplete_quizzes = db.query(Quizzes).filter(
    #     Quizzes.topic_id == topic.id,
    #     or_(
    #         Quizzes.question == None,
    #         Quizzes.option_a == None,
    #         Quizzes.option_b == None,
    #         Quizzes.option_c == None,
    #         Quizzes.option_d == None,
    #         Quizzes.correct_answer == None
    #     )
    # ).all()

    # if not incomplete_quizzes and db.query(Quizzes).filter(Quizzes.topic_id == topic.id).count() >= 3:
    #     print(f"⏩ Skipping (already has 3 complete quizzes): {topic.title}")
    #     continue

    print(f"📚 Generating quiz for: {topic.title}")

    prompt = (
        f"Generate 3 beginner multiple choice quiz questions for the topic '{topic.title}'. "
        "Each question should have a 'question', 4 options (a-d), and 'correct_answer'. "
        "Return only JSON, as a list of objects, with no explanation or formatting. "
        "Please only return raw JSON in an array format."
    )

    response_text = generate_quiz(prompt)
    if not response_text:
        print(f"⚠️ Skipped quiz for '{topic.title}'")
        continue

    quiz_items = extract_json(response_text)
    if not quiz_items:
        print(f"❌ Could not parse JSON quiz for {topic.title}")
        print("📦 Raw response that failed JSON extraction:\n", response_text)
        continue

    for item in quiz_items:
        if not all([item.get("question"), item.get("correct_answer"), item.get("option_a"), item.get("option_b"), item.get("option_c"), item.get("option_d")]):
            print(f"⚠️ Skipping incomplete quiz item for topic {topic.title}:")
            print(item)
            continue

        quiz = Quizzes(
            topic_id=topic.id,
            question=item.get("question"),
            correct_answer=item.get("correct_answer"),
            option_a=item.get("option_a"),
            option_b=item.get("option_b"),
            option_c=item.get("option_c"),
            option_d=item.get("option_d")
        )
        db.add(quiz)
    db.commit()
    print(f"✅ Quiz saved for: {topic.title}\n")

    # ⏳ Respect rate limits
    time.sleep(5)

db.close()
print("🎉 All quizzes generated.")
