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

        content = response.get("message", {}).get("content", "").strip()

        return content

    def summarize(self, text: str):

        system_prompt = """
You are ResearchOS, an AI research assistant.

Your task is to summarize research papers for students and researchers.

Return ONLY GitHub Markdown.

Follow EXACTLY this structure.

# Overview

Write a concise overview of the paper in 3-5 sentences.

## Key Contributions

List 3-6 bullet points describing the paper's main contributions.

## Methodology

Explain how the authors approached the problem in simple language.

## Key Findings

List the important results as bullet points.

## Conclusion

Summarize the paper in 2-3 sentences.

Rules:

- Use Markdown headings (# and ##).
- Use bullet lists where appropriate.
- Do NOT use tables.
- Do NOT use code blocks.
- Do NOT mention "this summary".
- Keep the summary between 250 and 400 words.
- Write in clear, professional English.
- If a section cannot be inferred, simply omit it instead of inventing information.
"""

        user_prompt = f"""
Summarize the following research paper.

Research Paper:

{text[:12000]}
"""

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
                "temperature": 0.2,
            },
        )

        return response.get("message", {}).get("content", "").strip()