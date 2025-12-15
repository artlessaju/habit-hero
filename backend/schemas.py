from pydantic import BaseModel
from typing import List, Optional

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# ... imports remain the same ...

# --- LOG SCHEMAS (Move this UP so Habit can see it) ---
class LogBase(BaseModel):
    date: str
    status: str
    note: Optional[str] = None
    sentiment: Optional[str] = None

class LogCreate(LogBase):
    pass

class Log(LogBase):
    id: int
    habit_id: int
    class Config:
        from_attributes = True

# --- HABIT SCHEMAS ---
class HabitBase(BaseModel):
    name: str
    category: str
    frequency: str
    start_date: str

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    user_id: int
    logs: List[Log] = [] # <--- THIS IS THE MAGIC LINE. It sends the history!
    class Config:
        from_attributes = True

# --- LOG SCHEMAS ---
class LogCreate(BaseModel):
    date: str
    status: str
    note: Optional[str] = None