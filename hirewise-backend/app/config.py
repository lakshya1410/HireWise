from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./hirewise.db"
    
    # Google Gemini
    gemini_api_key: str
    
    # CORS
    frontend_url: str = "http://localhost:8000"
    
    # File Upload
    max_upload_size: int = 5242880  # 5MB
    upload_dir: str = "./uploads"
    reports_dir: str = "./reports"
    
    class Config:
        env_file = ".env"

settings = Settings()
