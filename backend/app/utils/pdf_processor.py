import fitz
from pathlib import Path


class PDFProcessor:

    @staticmethod
    def process_pdf(pdf_path: str):

        document = fitz.open(pdf_path)

        text = ""

        for page in document:
            text += page.get_text()

        metadata = document.metadata

        result = {

            "filename": Path(pdf_path).name,

            "pages": len(document),

            "word_count": len(text.split()),

            "metadata": metadata,

            "text": text,

        }

        document.close()

        return result