from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from sqlalchemy.dialects.sqlite import BLOB
import uuid
from cryptography.fernet import Fernet
import os
from pydantic import BaseModel
import secrets
import string

DATABASE_URL = "sqlite:///./passwords.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))

class PasswordEntry(Base):
    __tablename__ = "passwords"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    site = Column(String, unique=True, index=True)
    login = Column(String)
    password = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_fernet():
    key_file = "secret.key"
    if not os.path.exists(key_file):
        key = Fernet.generate_key()
        with open(key_file, "wb") as f:
            f.write(key)
    else:
        with open(key_file, "rb") as f:
            key = f.read()
    return Fernet(key)

auth = get_fernet()

app = FastAPI()

origins = ["http://localhost:3000", "http://localhost:4000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordRequest(BaseModel):
    site: str
    login: str
    password: str = None

@app.get("/")
def read_root():
    return {"message": "Привет из FastAPI!"}

@app.post("/add_password/")
def add_password(request: PasswordRequest, db: Session = Depends(get_db)):
    password = request.password if request.password else generate_password()
    encrypted_password = auth.encrypt(password.encode()).decode()
    
    db_entry = PasswordEntry(site=request.site, login=request.login, password=encrypted_password)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    return {"message": "Запись сохранена!", "id": db_entry.id}

@app.delete("/delete_password/")
def delete_password(site: str, db: Session = Depends(get_db)):
    db_entry = db.query(PasswordEntry).filter(PasswordEntry.site == site).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    db.delete(db_entry)
    db.commit()
    return {"message": "Запись удалена!"}

@app.put("/update_password/")
def update_password(site: str, request: PasswordRequest, db: Session = Depends(get_db)):
    db_entry = db.query(PasswordEntry).filter(PasswordEntry.site == site).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    encrypted_password = auth.encrypt(request.password.encode()).decode()
    db_entry.login = request.login
    db_entry.password = encrypted_password
    db.commit()
    return {"message": "Запись обновлена!"}

@app.get("/get_passwords/")
def get_passwords(db: Session = Depends(get_db)):
    passwords = db.query(PasswordEntry).all()
    return [{"site": password.site, "login": password.login, "id": password.id, "password": "******"} for password in passwords]

@app.get("/get_password/")
def get_password(site: str, db: Session = Depends(get_db)):
    db_entry = db.query(PasswordEntry).filter(PasswordEntry.site == site).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    decrypted_password = auth.decrypt(db_entry.password.encode()).decode()
    return {"site": db_entry.site, "login": db_entry.login, "password": decrypted_password, "id": db_entry.id}

@app.head("/")
async def head_root():
    return {}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
