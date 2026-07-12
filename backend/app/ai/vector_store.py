import chromadb


class VectorStore:

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path="vector_db"
        )

        self.collection = self.client.get_or_create_collection(
            name="researchos"
        )

    def add_chunks(
        self,
        ids,
        documents,
        embeddings,
        metadata,
    ):

        self.collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings.tolist(),
            metadatas=metadata,
        )

    def search(
        self,
        query_embedding,
        k=5,
    ):

        return self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=k,
        )
    def similarity_search(
    self,
    query_embedding,
    project_id: int,
    k: int = 5,
):

         return self.collection.query(
             query_embeddings=     [query_embedding.tolist()],
             n_results=k,
             where={"project_id":      project_id},
         )