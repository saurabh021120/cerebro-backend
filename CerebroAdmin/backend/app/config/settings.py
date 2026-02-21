from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / ".env")


class Settings:
    """Application settings and configuration"""

    DATABASE_URL: str = os.environ["DATABASE_URL"]
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    @property
    def CORS_ORIGINS(self) -> list[str]:
        origins = os.getenv("CORS_ORIGINS", "*")
        if origins == "*":
            return ["*"]
        return [origin.strip() for origin in origins.split(",")]

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


settings = Settings()
