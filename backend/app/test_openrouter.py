from backend.app.utils.generate_description_openai import generate_description

topic = "Python Developer"
prompt = (
    f"Explain the topic '{topic}' in a structured and beginner-friendly way. "
    "Include what it is, why it matters, basic concepts, and real-world examples. "
    "Write in a clear and educational tone suitable for people new to programming."
)

result = generate_description(prompt)
print("\n📘 Generated description:\n")
print(result)
