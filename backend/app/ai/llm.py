import ollama


class LLM:

    def __init__(self):

        self.model = "llama3.2:3b"

    def answer(
        self,
        question: str,
        context: str,
    ):

        prompt = f"""
You are an AI Research Assistant.

Answer ONLY using the context below.

If the answer is not present, say:

"I could not find this information in the uploaded documents."

Context:

{context}

Question:

{question}
"""

        response = ollama.chat(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response["message"]["content"]