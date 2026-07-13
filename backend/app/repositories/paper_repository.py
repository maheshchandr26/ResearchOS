from sqlalchemy.orm import Session

from app.models.paper import Paper


class PaperRepository:

    @staticmethod
    def create(db: Session, paper: Paper):

        db.add(paper)

        db.commit()

        db.refresh(paper)

        return paper

    @staticmethod
    def get_project_papers(
        db: Session,
        project_id: int,
    ):
        return (
            db.query(Paper)
            .filter(Paper.project_id == project_id)
            .all()
        )
    @staticmethod
    def get_by_hash(
        db,
        project_id: int,
        sha256_hash: str,
    ):
        return (
            db.query(Paper)
            .filter(
                Paper.project_id ==     project_id,
                Paper.sha256_hash ==     sha256_hash,
            )
            .first()
        )