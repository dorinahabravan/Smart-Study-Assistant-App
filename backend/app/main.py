#Entry point for FastAPI app
# type: ignore
from fastapi import FastAPI
from backend.app.database import engine, Base
from backend.app.models.init import User, Topics, Quizzes, UserProgress, TopicDependency
from backend.app.routes import wikipedia  #Import your new route
from backend.app.routes import arxiv
from backend.app.routes import learn_api
from backend.app.routes import resources_api
from backend.app.routes import course_api
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import users_auth
from backend.app.routes import course_api
from  backend.app.routes import quiz
from backend.app.routes import user_progress



app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)



@app.on_event("startup")
def startup_event():
    print("✅ Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")

   # ✅ Allow frontend to connect (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Register the API router
app.include_router(wikipedia.router)
app.include_router(arxiv.router)
app.include_router(learn_api.router)
app.include_router(resources_api.router)
app.include_router(course_api.router)
app.include_router(users_auth.router)
app.include_router(course_api.router)
app.include_router(quiz.router)
app.include_router(user_progress.router, prefix="/api")



@app.get("/")
def read_root():
    return {"message": "Smart Study Assistant API is running!"}

    









