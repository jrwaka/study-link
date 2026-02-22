"""
Main URL configuration for studylink project
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # Quiz API endpoints
    path('api/quiz/', include('quiz.urls')),
]