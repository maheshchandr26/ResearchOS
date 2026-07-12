from app.ai.llm import LLM

llm = LLM()

context = """
Tuition Fee : 9110
"""

question = "What is the tuition fee?"

answer = llm.answer(
    question,
    context,
)

print(answer)