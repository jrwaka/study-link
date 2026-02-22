# StudyLink
A web platform that helps secondary school students access revision materials and practice quizzes.

## Problem Statement
Many Rwandan secondary students find it hard to access past exam papers and revision materials in one place. Resources are often scattered, making it difficult to study effectively and prepare for national exams.  
StudyLink provides a simple online platform where students can browse subjects, take quizzes, and track their scores, helping them revise more efficiently.

## Target Users
- Secondary students
- Teachers

## Core Features
- Browse subjects
- Take quizzes
- View scores

## Tech Stack
- Frontend: React (Vite)
- Backend: Django (Python)
- Data: JSON

## Project Setup

### Backend
```bash
cd server
python -m venv venv           # create virtual environment
source venv/bin/activate      # Linux / Mac
# OR venv\Scripts\activate    # Windows
pip install -r requirements.txt
python manage.py runserver
