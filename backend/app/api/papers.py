from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.paper import PaperResponse
from app.services.paper_service import PaperService

router = APIRouter(
    prefix="/papers",
    tags=["Papers"],
)


@router.post(
    "/upload/{project_id}",
    response_model=PaperResponse,
)
async def upload_paper(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    return await PaperService.upload_paper(
        db,
        project_id,
        file,
    )