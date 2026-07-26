import ollama


class LLM:

    def __init__(self):
        self.model = "llama3.2:3b"

    def answer(
        self,
        question: str,
        context: str,
    ):

        system_prompt = """
You are ResearchOS, an intelligent research assistant.

You MUST answer ONLY using the retrieved document chunks.

Each retrieved chunk has the following format:

Chunk ID: <number>
Paper: <paper name>
Page: <page number>

<chunk text>

----------------------------------------------------

Instructions:

1. Read all retrieved chunks carefully.
2. Use ONLY the provided information.
3. Never use outside knowledge.
4. If multiple chunks are relevant, combine them.
5. If the answer cannot be found, return:

{
  "answer": "I could not find this information in the uploaded documents.",
  "citations": []
}

Return ONLY valid JSON.

The JSON MUST have exactly this format:

{
  "answer": "<answer>",
  "citations": [
    {
      "chunk_id": 0,
      "evidence": "<exact sentence or phrase from the chunk>"
    }
  ]
}
Rules:
- evidence MUST be copied exactly from the retrieved chunk.
- Never rewrite the evidence.
- Keep evidence short (5-40 words).
- citations must contain ONLY chunks actually used.
- citations must contain ONLY the Chunk IDs used to generate the answer.
- Never cite chunks that were not used.
- Never explain your reasoning.
- Never return Markdown.
- Never wrap the JSON inside ``` blocks.
"""

        user_prompt = f"""
Retrieved Chunks

{context}

----------------------------------------------------

Question:

{question}

Return ONLY valid JSON.
"""

        print("=" * 80)
        print("SYSTEM PROMPT")
        print("=" * 80)
        print(system_prompt)

        print("=" * 80)
        print("USER PROMPT")
        print("=" * 80)
        print(user_prompt)

        response = ollama.chat(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            options={
                "temperature": 0,
            },
        )

        print("=" * 80)
        print("RAW OLLAMA RESPONSE")
        print("=" * 80)
        print(response)

        content = response.get("message", {}).get("content", "").strip()

        print("=" * 80)
        print("RAW JSON FROM LLM")
        print("=" * 80)
        print(content)
        print("=" * 80)

        return content

    def summarize(self, text: str):

        prompt = f"""
Summarize the following document in 150-200 words.

Document:

{text[:12000]}
"""

        response = ollama.chat(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            options={
                "temperature": 0,
            },
        )

        return response.get("message", {}).get("content", "")