from backend.app.database import SessionLocal
from backend.app.models.init import Quizzes

db = SessionLocal()

db.query(Quizzes).delete()
db.commit()
db.close()
print("✅ Quizzes table cleared.")
