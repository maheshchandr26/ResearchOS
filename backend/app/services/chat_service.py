from sqlalchemy.orm import Session

from app.ai.embeddings import EmbeddingGenerator
from app.ai.llm import LLM
from app.ai.vector_store import VectorStore
from app.services.chat_session_service import ChatSessionService
from app.utils.logger import chat_logger
from app.ai.query_rewriter import QueryRewriter
import os
import json
print(os.path.abspath("vector_db"))
class ChatService:

    @staticmethod
    def ask(
        db: Session,
        project_id: int,
        question: str,
    ):

        # --------------------------------------------------
        # Get or Create Chat Session
        # --------------------------------------------------

        session = ChatSessionService.get_or_create_session(
            db=db,
            project_id=project_id,
        )

        # --------------------------------------------------
        # Load Previous Conversation
        # --------------------------------------------------

        history = ChatSessionService.get_recent_messages(
            db=db,
            session_id=session.id,
            limit=10,
        )

        conversation_history = "\n".join(
            f"{message.role.capitalize()}: {message.content}"
            for message in reversed(history)
        )

        # --------------------------------------------------
        # Generate Query Embedding
        # --------------------------------------------------

        # --------------------------------------------------
# Rewrite Question
# --------------------------------------------------

        rewritten_question = question

        chat_logger.info(f"Question: {question}")

        chat_logger.info(
            f"Original Question: {question}"
        )

        chat_logger.info(
            f"Rewritten Question:         {rewritten_question}"
        )

# --------------------------------------------------
# Generate Query Embedding
# --------------------------------------------------

        generator = EmbeddingGenerator()

        query_vector = generator.generate_query(
        rewritten_question
        )

        # --------------------------------------------------
        # Retrieve Relevant Chunks
        # --------------------------------------------------

        store = VectorStore()
        print("\n" + "=" * 80)
        print("CHAT DEBUG")
        print("=" * 80)

        print("VECTOR DB PATH:")
        print(os.path.abspath("vector_db"))

        print("\nCOLLECTION COUNT:")
        print(store.collection.count())

        print("\nCOLLECTION PEEK:")
        print(store.collection.peek())

        print("=" * 80)
        results = store.similarity_search(
            query_embedding=query_vector,
            project_id=project_id,
            k=8,
        )
        print("=" * 80)
        print(results)
        print("=" * 80)

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]

        if not documents:

            answer = (
                "I could not find this information "
                "in the uploaded documents."
            )

            ChatSessionService.add_message(
                db,
                session.id,
                "user",
                question,
            )

            ChatSessionService.add_message(
                db,
                session.id,
                "assistant",
                answer,
            )

            return {
                "answer": answer,
                "sources": [],
            }

        # --------------------------------------------------
        # Build Context
        # --------------------------------------------------

        document_context = ""

        for i, (doc, metadata) in enumerate(zip(documents, metadatas)):
            document_context += f"""
        Chunk ID: {i}
        Paper: {metadata['paper_name']}
        Page: {metadata['page']}

        {doc}

        ----------------------------------------------------
        """

        llm_context = f"""
Conversation History
--------------------
{conversation_history}

Retrieved Documents
-------------------
{document_context}
"""

        # --------------------------------------------------
        # Ask LLM
        # --------------------------------------------------

        llm = LLM()

        raw_response = llm.answer(
           question=rewritten_question,
            context=llm_context,
        )

        try:
            parsed = json.loads(raw_response)

            answer = parsed.get("answer", "")
            citations = parsed.get("citations", [])

        except Exception as e:

            print("=" * 80)
            print("FAILED TO PARSE LLM JSON")
            print(e)
            print(raw_response)
            print("=" * 80)

            answer = raw_response
            cited_chunks = []
        print("=" * 80)
        print("ANSWER RETURNED BY LLM")
        print(repr(answer))
        print("=" * 80)
        chat_logger.info(
            f"""
        Project ID: {project_id}

        Original Question:
        {question}

        Rewritten Question:
        {rewritten_question}
        """
        )

        # --------------------------------------------------
        # Save Conversation
        # --------------------------------------------------

        ChatSessionService.add_message(
            db,
            session.id,
            "user",
            question,
        )

        ChatSessionService.add_message(
            db,
            session.id,
            "assistant",
            answer,
        )

        # --------------------------------------------------
        # Prepare Sources
        # --------------------------------------------------

        sources = []

        seen = set()

        for citation in citations:

            chunk_id = citation.get("chunk_id")
            evidence = citation.get("evidence", "").strip()

            if chunk_id is None:
                continue

            if chunk_id >= len(documents):
                continue

            metadata = metadatas[chunk_id]

            key = (
                metadata["paper_id"],
                metadata["page"],
            )

            if key in seen:
                continue

            seen.add(key)

            sources.append(
                {
                    "paper_id": metadata["paper_id"],
                    "paper_name": metadata["paper_name"],
                    "page": metadata["page"],
                    "evidence": evidence,
                    "highlight_text": documents[chunk_id],
                    "confidence": "High",
                }
            )

        return {
            "answer": answer,
            "sources": sources,
        }