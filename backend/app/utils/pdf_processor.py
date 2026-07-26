import fitz
from pathlib import Path


class PDFProcessor:

    @staticmethod
    def process_pdf(pdf_path: str):

        document = fitz.open(pdf_path)

        full_text = ""
        page_texts = []

        for page_number, page in enumerate(document, start=1):

            page_text = page.get_text()

            full_text += page_text

            page_texts.append(
                {
                    "page": page_number,
                    "text": page_text,
                }
            )

        metadata = document.metadata

        result = {

            "filename": Path(pdf_path).name,

            "pages": len(document),

            "word_count": len(full_text.split()),

            "metadata": metadata,

            "text": full_text,

            # NEW
            "page_texts": page_texts,

        }

        document.close()

        return result