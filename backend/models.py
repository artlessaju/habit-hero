from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# --- USER MODEL (Like your User Schema) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)  # We will hash this later

    # Relationship: One User has Many Habits
    habits = relationship("Habit", back_populates="owner")


# --- HABIT MODEL (Like your Habit Schema) ---
class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)      # e.g., "Drink Water"
    category = Column(String)              # e.g., "Health"
    frequency = Column(String)             # e.g., "Daily"
    start_date = Column(String)            # e.g., "2023-12-15"
    user_id = Column(Integer, ForeignKey("users.id")) # Link to User table

    # Relationships
    owner = relationship("User", back_populates="habits")
    logs = relationship("HabitLog", back_populates="habit")


# --- LOG MODEL (To track daily completions) ---
class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)        # e.g., "2023-12-15"
    status = Column(String)      # "Completed" or "Missed"
    note = Column(String)        # "I felt great"
    sentiment = Column(String)   # "Positive" (AI will fill this)
    habit_id = Column(Integer, ForeignKey("habits.id")) # Link to Habit table

    habit = relationship("Habit", back_populates="logs")