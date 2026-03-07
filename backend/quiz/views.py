from django.shortcuts import render


"""
API Views for the Quiz app
Handles quiz logic and session management
"""
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer, AnswerSerializer, AnswerCheckSerializer

@api_view(['GET'])
def get_all_questions(request):
    """
    API endpoint to get all questions
    Can filter by ?category=
    """
    category = request.GET.get('category', None)

    if category:
        questions = Question.objects.filter(category__iexact=category)
    else:
        questions = Question.objects.all()

    serializer = QuestionSerializer(questions, many=True)

    return Response({
        'questions': serializer.data,
        'total_questions': questions.count()
    })


@api_view(['POST'])
def check_answer(request):
    """
    API endpoint to check if an answer is correct
    Accepts question_id and selected_answer
    Returns whether correct and updates session
    """
    # Validate the incoming data
    serializer = AnswerSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Get the question
    question_id = serializer.validated_data['question_id']
    selected_answer = serializer.validated_data['selected_answer']
    
    try:
        question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return Response(
            {'error': 'Question not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if answer is correct
    is_correct = (selected_answer == question.correct_answer)
    
    # Update session
    if 'answers' not in request.session:
        request.session['answers'] = []
    
    # Record this answer
    answer_record = {
        'question_id': question_id,
        'question_text': question.question_text,
        'selected_answer': selected_answer,
        'correct_answer': question.correct_answer,
        'is_correct': is_correct,
        'explanation': question.explanation
    }
    
    answers = request.session['answers']
    answers.append(answer_record)
    request.session['answers'] = answers
    
    # Update score if correct
    if is_correct:
        request.session['score'] = request.session.get('score', 0) + 1
    
    # Update current question index
    request.session['current_question'] = len(answers)
    
    # Save session
    request.session.modified = True
    
    # Return result
    result_serializer = AnswerCheckSerializer(data={
        'is_correct': is_correct,
        'correct_answer': question.correct_answer,
        'explanation': question.explanation,
        'your_answer': selected_answer
    })
    result_serializer.is_valid()
    
    return Response(result_serializer.data)

@api_view(['GET'])
def get_results(request):
    """
    API endpoint to get quiz results
    Returns score and detailed answer review
    """
    answers = request.session.get('answers', [])
    score = request.session.get('score', 0)
    total = request.session.get('total_questions', Question.objects.count())
    
    # Calculate percentage
    percentage = (score / total * 100) if total > 0 else 0
    
    # Determine performance level
    if percentage >= 80:
        performance = "Excellent"
    elif percentage >= 60:
        performance = "Good"
    elif percentage >= 40:
        performance = "Fair"
    else:
        performance = "Needs Improvement"
    
    return Response({
        'score': score,
        'total': total,
        'percentage': round(percentage, 1),
        'performance': performance,
        'answers_review': answers,
        'correct_count': score,
        'incorrect_count': total - score
    })

@api_view(['POST'])
def reset_quiz(request):
    """
    API endpoint to reset the quiz session
    Clears all progress data
    """
    # Clear quiz-related session data
    keys_to_delete = ['quiz_started', 'current_question', 'score', 'answers']
    for key in keys_to_delete:
        if key in request.session:
            del request.session[key]
    
    request.session.modified = True
    
    return Response({
        'message': 'Quiz reset successfully',
        'status': 'ready_to_start'
    })

@api_view(['GET'])
def get_question_by_id(request, question_id):
    """
    API endpoint to get a specific question
    """
    question = get_object_or_404(Question, id=question_id)
    serializer = QuestionSerializer(question)
    return Response(serializer.data)

@api_view(['GET'])
def get_progress(request):
    """
    API endpoint to get current quiz progress
    """
    return Response({
        'current_question': request.session.get('current_question', 0),
        'score': request.session.get('score', 0),
        'total_questions': request.session.get('total_questions', Question.objects.count()),
        'answers_count': len(request.session.get('answers', []))
    })