# backend/app/create_tables.py

from backend.app.database import Base, engine
from backend.app.models import init

print("✅ Creating tables in the cloud DB...")
Base.metadata.create_all(bind=engine)
print("🎉 Tables created successfully!")
