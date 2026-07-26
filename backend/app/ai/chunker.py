from langchain_text_splitters import RecursiveCharacterTextSplitter


class Chunker:

    def __init__(
        self,
        chunk_size: int = 800,
        chunk_overlap: int = 150,
    ):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                "",
            ],
        )

    def chunk(self, page_texts):

        chunks = []

        for page_data in page_texts:

            page = page_data["page"]

            texts = self.splitter.split_text(
                page_data["text"]
            )

            for text in texts:

                chunks.append(
                    {
                        "text": text,
                        "page": page,
                    }
                )

        return chunks