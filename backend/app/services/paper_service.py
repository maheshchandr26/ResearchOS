from pathlib import Path
import shutil

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.paper import Paper
from app.repositories.paper_repository import PaperRepository
from app.utils.pdf_processor import PDFProcessor
from app.ai.chunker import Chunker
from app.ai.embeddings import EmbeddingGenerator
from app.ai.vector_store import VectorStore

UPLOAD_DIR = Path("uploads")


class PaperService:

    @staticmethod
    async def upload_paper(
        db: Session,
        project_id: int,
        file: UploadFile,
    ):

        project_folder = UPLOAD_DIR / f"project_{project_id}"

        project_folder.mkdir(
            parents=True,
            exist_ok=True,
        )
        
        destination = project_folder / file.filename

        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        pdf = PDFProcessor.  process_pdf(
         str(destination)
)
        chunker = Chunker()

        chunks = chunker.chunk(pdf["text"])
        embedding_generator = EmbeddingGenerator()

        embeddings = embedding_generator.generate(chunks)
        paper = Paper(
          project_id=project_id,
          title=file.filename,
          filename=file.filename,
          file_path=str(destination),
          file_size=destination.stat().st_size,
          raw_text=pdf["text"],
          page_count=pdf["pages"],
          word_count=pdf["word_count"],
)
        vector_store = VectorStore()

        vector_store.add_chunks(
            ids=[
                f"{project_id}_{i}"
                for i in range(len(chunks))
            ],
            documents=chunks,
            embeddings=embeddings,
            metadata=[
                {
                    "project_id": project_id,
                    "paper_name": file.        filename,
                    "chunk": i,
                }
                for i in range(len(chunks))
            ],
        )

        return PaperRepository.create(
            db,
            paper,
        )