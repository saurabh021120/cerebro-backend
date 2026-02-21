from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.database import engine, Base
from app.api.routes.admin_routes import router as admin_router

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="Cerebro Admin API", version="1.0.0")

# Log CORS origins for debugging
logger.info(f"CORS Origins: {settings.CORS_ORIGINS}")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Register admin router
app.include_router(admin_router, prefix="/api")


@app.on_event("startup")
async def startup():
    """Initialize database on startup"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized successfully")


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Cerebro Admin API is running"}


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}
