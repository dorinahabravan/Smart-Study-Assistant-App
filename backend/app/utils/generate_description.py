import os
import requests

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"

HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

def generate_description(prompt: str) -> str:
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})
    if response.status_code == 200:
        generated = response.json()
        return generated[0]["generated_text"]
    else:
        print("❌ Hugging Face API error:", response.status_code, response.text)
        return "No description available yet."
