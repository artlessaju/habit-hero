from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Create the Database File (It will appear as 'habit_hero.db' in your folder)
SQLALCHEMY_DATABASE_URL = "sqlite:///./habit_hero.db"

# 2. Connect to it
# (check_same_thread=False is needed only for SQLite)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Create a Session Factory (This is what allows us to read/write data later)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. The Base Class (All our models will inherit from this)
Base = declarative_base()