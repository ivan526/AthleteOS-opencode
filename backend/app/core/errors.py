from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from jwt import PyJWTError
import logging

logger = logging.getLogger(__name__)


class APIError(Exception):
    """Base API Error"""
    def __init__(self, message: str, status_code: int = 400, code: str | None = None):
        self.message = message
        self.status_code = status_code
        self.code = code or "error"
        super().__init__(message)


class UnauthorizedError(APIError):
    def __init__(self, message: str = "未授权访问"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED, "unauthorized")


class NotFoundError(APIError):
    def __init__(self, message: str = "资源不存在"):
        super().__init__(message, status.HTTP_404_NOT_FOUND, "not_found")


class BadRequestError(APIError):
    def __init__(self, message: str = "请求参数错误"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, "bad_request")


async def api_error_handler(request: Request, exc: APIError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.message,
                "code": exc.code
            }
        }
    )


async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = []
    for err in exc.errors():
        field = ".".join(str(loc) for loc in err["loc"]) if err["loc"] else "unknown"
        errors.append({
            "field": field,
            "message": err["msg"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "message": "请求参数验证失败",
                "code": "validation_error",
                "details": errors
            }
        }
    )


async def jwt_error_handler(request: Request, exc: PyJWTError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "success": False,
            "error": {
                "message": "认证令牌无效或已过期",
                "code": "invalid_token"
            }
        }
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "message": "服务器内部错误",
                "code": "internal_error"
            }
        }
    )
