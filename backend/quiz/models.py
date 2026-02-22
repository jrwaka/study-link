"""
Quiz app models for StudyLink
Defines the Question model for storing quiz questions
"""

from django.db import models

class Question(models.Model):
    """
    Model representing a quiz question about Rwanda/East Africa
    """
    # Categories for organizing questions
    CATEGORY_CHOICES = [
        ('HISTORY', 'Rwandan History'),
        ('GEOGRAPHY', 'Geography'),
        ('CULTURE', 'Culture & Traditions'),
        ('ECONOMICS', 'Economics'),
        ('LANGUAGE', 'Languages'),
    ]
    
    # Question text
    question_text = models.TextField(
        help_text="The question to display to users"
    )
    
    # Multiple choice options
    option_a = models.CharField(
        max_length=200,
        help_text="Option A"
    )
    option_b = models.CharField(
        max_length=200,
        help_text="Option B"
    )
    option_c = models.CharField(
        max_length=200,
        help_text="Option C"
    )
    option_d = models.CharField(
        max_length=200,
        help_text="Option D"
    )
    
    # Correct answer (store the full option text, not just letter)
    correct_answer = models.CharField(
        max_length=200,
        help_text="The correct answer (full text)"
    )
    
    # Explanation for learning
    explanation = models.TextField(
        help_text="Explanation of the correct answer"
    )
    
    # Category for filtering
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='HISTORY',
        help_text="Question category"
    )
    
    # Timestamp for ordering
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the question was added"
    )
    
    class Meta:
        ordering = ['category', 'id']
        
    def __str__(self):
        """String representation of the question"""
        return f"{self.get_category_display()}: {self.question_text[:50]}..."
    
    def get_options(self):
        """Return all options as a list"""
        return [self.option_a, self.option_b, self.option_c, self.option_d]