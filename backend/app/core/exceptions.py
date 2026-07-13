from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.utils.logger import backend_logger


async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
):
    backend_logger.warning(
        f"{request.method} {request.url.path} -> {exc.status_code} | {exc.detail}"
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
        },
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    backend_logger.warning(
        f"Validation Error: {exc.errors()}"
    )

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed.",
            "errors": exc.errors(),
        },
    )


async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
):
    backend_logger.exception(exc)

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
        },
    )