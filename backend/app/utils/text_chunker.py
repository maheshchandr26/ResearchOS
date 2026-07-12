from dataclasses import dataclass


@dataclass
class TextChunk:
    chunk_id: int
    text: str
    start: int
    end: int


class TextChunker:

    @staticmethod
    def chunk_text(
        text: str,
        chunk_size: int = 800,
        overlap: int = 150,
    ):

        chunks = []

        start = 0
        chunk_id = 1

        while start < len(text):

            end = min(start + chunk_size, len(text))

            chunk = TextChunk(
                chunk_id=chunk_id,
                text=text[start:end],
                start=start,
                end=end,
            )

            chunks.append(chunk)

            start += chunk_size - overlap
            chunk_id += 1

        return chunks