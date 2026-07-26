from pathlib import Path
import shutil
import os
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.paper import Paper
from app.repositories.paper_repository import PaperRepository
from app.utils.pdf_processor import PDFProcessor
from app.ai.chunker import Chunker
from app.ai.embeddings import EmbeddingGenerator
from app.ai.vector_store import VectorStore
from fastapi import HTTPException

from app.utils.hash_utils import calculate_sha256
from app.utils.logger import upload_logger
UPLOAD_DIR = Path("uploads")
from app.ai.llm import LLM
import os

print(os.path.abspath("vector_db"))
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
        sha256_hash = calculate_sha256(str(destination)
        )
        existing = PaperRepository.get_by_hash(
            db=db,
            project_id=project_id,
            sha256_hash=sha256_hash,
        )

        if existing:
            destination.unlink        (missing_ok=True)

            raise HTTPException(
                status_code=409,
                detail="This PDF has already         been uploaded to this         project.",
            )
        pdf = PDFProcessor.  process_pdf(
         str(destination)
)
        chunker = Chunker()

        chunks = chunker.chunk(
        pdf["page_texts"]
        )
        print("\n" + "=" * 80)
        print("TOTAL CHUNKS:", len(chunks))

        for i, chunk in enumerate(chunks):
            print("\n" + "-" * 80)
            print(f"CHUNK {i}")
            print("-" * 80)
            print(chunk)

        print("=" * 80)

        embedding_generator = EmbeddingGenerator()

        embeddings = embedding_generator.generate_documents(
            [
                c["text"]
                for c in chunks
            ]
    )

# Generate AI summary
        llm = LLM()

        summary = llm.summarize(pdf["text"])
        paper = Paper(
          project_id=project_id,
          title=file.filename,
          filename=file.filename,
          file_path=str(destination),
          sha256_hash=sha256_hash,
          file_size=destination.stat().st_size,
          raw_text=pdf["text"],
          summary=summary,
          page_count=pdf["pages"],
          word_count=pdf["word_count"],
)
        paper =  PaperRepository.create(
            db,
            paper,
        )
        upload_logger.info(
            f"Paper uploaded | "
            f"Project={project_id} | "
            f"Paper={paper.filename} | "
            f"Pages={paper.page_count} | "
            f"Words={paper.word_count}"
)
        vector_store = VectorStore()

        vector_store.add_chunks(
            ids=[
                f"{project_id}_{paper.id}_{i}"
                for i in range(len(chunks))
            ], 
            documents=[
                 c["text"]
                 for c in chunks
             ],
            embeddings=embeddings,
            metadata=[
                {
                    "project_id": project_id,
                    "paper_id": paper.id,
                    "paper_name": file.filename,
                    "chunk": i,
                    "page": chunks[i]["page"],
                }
                for i in range(len(chunks))
            ],
        )
        print("\n" + "=" * 80)
        print("UPLOAD DEBUG")
        print("=" * 80)

        print("VECTOR DB PATH:")
        print(os.path.abspath("vector_db"))

        print("\nCOLLECTION COUNT:")
        print(vector_store.collection.count())

        print("\nCOLLECTION PEEK:")
        print(vector_store.collection.peek())

        print("=" * 80)
        return paper
    @staticmethod
    def get_project_papers(
    db: Session,
    project_id: int,
):
      return PaperRepository.get_project_papers(
        db,
        project_id,
    )
    @staticmethod
    def delete_paper(
      db: Session,
      paper_id: int,
    ):
      paper = (
         db.query(Paper)
         .filter(Paper.id == paper_id)
         .first()
      )

      if not paper:
         raise HTTPException(
                status_code=404,
                detail="Paper not found",
            )

      file = Path(paper.file_path)
  
      if file.exists():
           os.remove(file)

      db.delete(paper)
      db.commit()
  
      return {
           "message": "Paper deleted        successfully."
       }