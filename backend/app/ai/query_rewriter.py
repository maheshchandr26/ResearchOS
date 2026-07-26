import ollama


class QueryRewriter:

    def __init__(self):
        self.model = "llama3.2:3b"

    def rewrite(
        self,
        history: str,
        question: str,
    ) -> str:

        if not history.strip():
            return question

        prompt = f"""
You are an AI assistant.

Rewrite the user's latest question into a complete standalone question.

Rules:

- Preserve the original meaning.
- Replace words like:
  it
  this
  that
  they
  those
  he
  she
with the correct subject from the conversation.

Return ONLY the rewritten question.

Conversation:

{history}

Current Question:

{question}

Standalone Question:
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

        rewritten = response["message"]["content"].strip()

        print("\n==============================")
        print("HISTORY:")
        print(history)
        print("------------------------------")
        print("QUESTION:")
        print(question)
        print("------------------------------")
        print("REWRITTEN:") 
        print(rewritten)
        print("==============================\n")

        if rewritten:
            return rewritten

        return question        