from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from jwt import PyJWTError
from app.api.training import router as training_router
from app.api.sync import router as sync_router
from app.api.auth import router as auth_router
from app.api.settings import router as settings_router
from app.core.errors import (
    APIError,
    api_error_handler,
    validation_error_handler,
    jwt_error_handler,
    general_exception_handler
)

app = FastAPI(
    title="AthleteOS API",
    version="1.1.0",
    description="AI-Powered Endurance Training Coach API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册异常处理器
app.add_exception_handler(APIError, api_error_handler)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(PyJWTError, jwt_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# 注册路由
app.include_router(auth_router, prefix="/api/v1")
app.include_router(training_router, prefix="/api/v1")
app.include_router(sync_router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "AthleteOS Training Engine API",
        "version": "1.1.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
