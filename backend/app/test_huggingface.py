import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"


headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}

def generate_description(prompt: str) -> str:
    import os
    import requests

    api_key = os.getenv("HUGGINGFACE_API_KEY")
    print(f"🔐 Loaded HF key: {api_key}")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 1024,
            "temperature": 0.7
        }
    }

    try:
        response = requests.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        result = response.json()
        print("🔁 Full Hugging Face response:", result)

        if isinstance(result, list) and "generated_text" in result[0]:
            return result[0]["generated_text"]
        else:
            return "⚠️ Unexpected response format"
    except requests.RequestException as e:
        print(f"❌ Hugging Face API error: {e}")
        return None


if __name__ == "__main__":
    os.environ["HUGGINGFACE_API_KEY"] = os.getenv("HUGGINGFACE_API_KEY")  # Make sure it's loaded
    print("🔐 Loaded Hugging Face key:", os.getenv("HUGGINGFACE_API_KEY"))
    topic = "OOP in Java"
    prompt = (
        f"Explain the topic '{topic}' in a structured and beginner-friendly way. "
        "Include what it is, why it matters, basic concepts, and real-world examples. "
        "Write in a clear and educational tone suitable for people new to programming."
    )
    result = generate_description(prompt)
    print("\n📘 Generated description:\n")
    print(result)
