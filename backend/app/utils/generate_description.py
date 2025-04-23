import os
import requests
from dotenv import load_dotenv

load_dotenv()  # ✅ Load from .env file
print("🔐 Loaded HF key:", os.getenv("HUGGINGFACE_API_KEY"))


HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

def generate_description(prompt: str):
    API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"
    headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}

    try:
        response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
        response.raise_for_status()

        result = response.json()
        # DEBUG
        print("🔁 Full Hugging Face response:", result)

        # Extract the generated text safely
        if isinstance(result, list) and "generated_text" in result[0]:
            full_text = result[0]["generated_text"]
            # Strip off the prompt from the front
            return full_text.replace(prompt, "").strip()

    except Exception as e:
        print(f"❌ Hugging Face API error: {e}")
        return None
