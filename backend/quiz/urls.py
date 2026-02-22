"""
URL configuration for the Quiz app
Maps URLs to view functions
"""

from django.urls import path
from . import views

urlpatterns = [
    # Get all questions
    path('questions/', views.get_all_questions, name='get_all_questions'),
    
    # Get specific question by ID
    path('questions/<int:question_id>/', views.get_question_by_id, name='get_question'),
    
    # Check an answer
    path('check-answer/', views.check_answer, name='check_answer'),
    
    # Get results
    path('results/', views.get_results, name='get_results'),
    
    # Reset quiz
    path('reset/', views.reset_quiz, name='reset_quiz'),
    
    # Get progress
    path('progress/', views.get_progress, name='get_progress'),
]