print("PAPERS ROUTER LOADED")
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
from fastapi.responses import FileResponse
from pathlib import Path
from app.models.paper import Paper
from fastapi import HTTPException
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
@router.get("/file/{paper_id}")
def get_pdf_file(
    paper_id: int,
    db: Session = Depends(get_db),
):
    print("=" * 50)
    print("GET /papers/file endpoint called")
    print("paper_id =", paper_id)
    print("=" * 50)

    paper = db.query(Paper).filter(
        Paper.id == paper_id
    ).first()

    print("paper =", paper)

    if not paper:
        raise HTTPException(
            status_code=404,
            detail="Paper not found",
        )

    path = Path(paper.file_path)

    print("Stored path :", paper.file_path)
    print("Resolved path :", path.resolve())
    print("Exists :", path.exists())

    return FileResponse(
    path,
    media_type="application/pdf",
    headers={
        "Content-Disposition": f'inline; filename="{paper.filename}"'
    },
)
@router.delete("/{paper_id}")
def delete_paper(
    paper_id: int,
    db: Session = Depends(get_db),
):
    return PaperService.delete_paper(
        db,
        paper_id,
    )
@router.get(
    "/project/{project_id}",
    response_model=list[PaperResponse],
)
def get_project_papers(
    project_id: int,
    db: Session = Depends(get_db),
):
    return PaperService.get_project_papers(
        db,
        project_id,
    )