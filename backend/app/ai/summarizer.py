from app.ai.llm import LLM


class PaperSummarizer:

    @staticmethod
    def generate(text: str) -> str:

        prompt = f"""
You are an academic research assistant.

Write a concise summary (150-250 words).

Paper:

{text[:12000]}
"""

        llm = LLM()

        return llm.generate(prompt)