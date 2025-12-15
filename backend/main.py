from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from textblob import TextBlob
from database import SessionLocal, engine
from passlib.context import CryptContext # 1. IMPORT SECURITY TOOL
import models, schemas

# Create Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Setup Security (Bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- HELPER FUNCTIONS ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"message": "Habit Hero Backend is Running!"}

# 1. REGISTER (NOW SECURE)
@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # HASH THE PASSWORD BEFORE SAVING
    hashed_password = get_password_hash(user.password)
    
    new_user = models.User(username=user.username, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 2. LOGIN (NOW SECURE)
@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    # VERIFY HASH INSTEAD OF PLAIN STRING
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    return {"status": "success", "user_id": db_user.id, "username": db_user.username}

# 3. CREATE HABIT
@app.post("/habits", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, user_id: int, db: Session = Depends(get_db)):
    new_habit = models.Habit(**habit.dict(), user_id=user_id)
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return new_habit

# 4. GET HABITS
@app.get("/habits/{user_id}", response_model=List[schemas.Habit])
def get_habits(user_id: int, db: Session = Depends(get_db)):
    habits = db.query(models.Habit).filter(models.Habit.user_id == user_id).all()
    return habits

# 5. LOG HABIT
@app.post("/habits/{habit_id}/log")
def log_habit(habit_id: int, log: schemas.LogCreate, db: Session = Depends(get_db)):
    # AI Logic
    ai_score = 0
    if log.note:
        blob = TextBlob(log.note)
        ai_score = blob.sentiment.polarity 

    sentiment_label = "Neutral"
    if ai_score > 0.3: sentiment_label = "Positive"
    elif ai_score < -0.3: sentiment_label = "Negative"

    new_log = models.HabitLog(
        date=log.date,
        status=log.status,
        note=log.note,
        sentiment=sentiment_label,
        habit_id=habit_id
    )
    db.add(new_log)
    db.commit()
    return {"status": "logged", "sentiment": sentiment_label}

# ... existing imports ...

# 6. DELETE HABIT
@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Delete the logs associated with the habit first (optional but good practice)
    db.query(models.HabitLog).filter(models.HabitLog.habit_id == habit_id).delete()
    
    # Delete the habit
    db.delete(habit)
    db.commit()
    return {"status": "deleted"}