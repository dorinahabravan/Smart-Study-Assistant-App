import os
import requests
from dotenv import load_dotenv

load_dotenv()
print("🔐 Loaded OpenRouter key:", os.getenv("OPENROUTER_API_KEY"))

def generate_description(prompt: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "meta-llama/llama-3-8b-instruct",
        "max_tokens": 1024,  # 🛠️ increase token limit
        "temperature": 0.7,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"❌ OpenRouter API error: {e}")
        return None
