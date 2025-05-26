from pydantic import BaseModel

class UserProgressCreate(BaseModel):
    topic_id: int
    quiz_score: int
    completed: bool
