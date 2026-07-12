from app.ai.embeddings import EmbeddingGenerator
from app.ai.llm import LLM
from app.ai.vector_store import VectorStore


class ChatService:

    @staticmethod
    def ask(project_id: int,question: str):

        generator = EmbeddingGenerator()

        query_vector = generator.generate([question])[0]

        store = VectorStore()

        results = store.similarity_search(
    query_vector,
    project_id=project_id,
    k=3,
)

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]

        if not documents:
          return {
              "answer": "I could not find             this information in the             uploaded documents.",
              "sources": [],
          }

        context = "\n\n".join(documents)

        llm = LLM()

        answer = llm.answer(
           question,
           context,
        )

        sources = [
            {
                "paper_name": metadata["paper_name"],
               "chunk": metadata["chunk"],
           }
           for metadata in metadatas
        ]

        return {
           "answer": answer,
           "sources": sources,
        }