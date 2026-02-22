"""
Serializers for the Quiz app
Convert Django models to JSON for the API
"""

from rest_framework import serializers
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Question model
    Converts Question instances to JSON
    """
    # Add a field for options list
    options = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = [
            'id', 
            'question_text', 
            'options',
            'category',
            'explanation'
        ]
        # Don't send correct answer to client (they'd see it!)
        read_only_fields = ['explanation']
    
    def get_options(self, obj):
        """Return options as a list"""
        return obj.get_options()
    
class AnswerSerializer(serializers.Serializer):
    """
    Serializer for validating submitted answers
    """
    question_id = serializers.IntegerField()
    selected_answer = serializers.CharField(max_length=200)
    
    def validate_question_id(self, value):
        """Check if question exists"""
        if not Question.objects.filter(id=value).exists():
            raise serializers.ValidationError("Question not found")
        return value

class AnswerCheckSerializer(serializers.Serializer):
    """
    Serializer for returning answer check results
    """
    is_correct = serializers.BooleanField()
    correct_answer = serializers.CharField()
    explanation = serializers.CharField()
    your_answer = serializers.CharField()