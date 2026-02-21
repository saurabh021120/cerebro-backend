from app.dto import Quiz, QuizQuestion

# Test Quiz model_dump
questions = [
    QuizQuestion(
        id="test-id",
        question="Test?",
        options=["A", "B"],
        correct_answer=0,
        explanation="Test",
    )
]

quiz = Quiz(id="quiz-id", title="Test Quiz", questions=questions, passing_score=80)

print("Quiz dict:", quiz.model_dump())
print("Has passing_score:", "passing_score" in quiz.model_dump())
