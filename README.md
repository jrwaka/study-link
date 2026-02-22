# StudyLink

A web platform that helps secondary school students practice quizzes.

## African Context

In many African countries, including Rwanda, secondary school students struggle to access past exam papers and revision materials in one centralized location. Resources are often scattered across schools, websites, and physical libraries, making effective exam preparation difficult. StudyLink addresses this challenge by providing a simple, online platform for students to revise efficiently, track their progress, and improve their learning outcomes.

## Team Members

- Junior Rwaka – DevOps Lead  
- Ketia Mukakalisa – Frontend Lead
- Mairo Pedro Isaac – Backend Lead

## Project Overview

StudyLink is a web application designed to help secondary school students prepare for exams by providing quizzes and score tracking. Students can select subjects, attempt quizzes, and immediately see their results to identify areas where they need improvement.  

The platform is built with a clean separation of frontend and backend to allow easy expansion and maintenance. While the first iteration focuses on quizzes, the system is designed to scale for future features like content management, detailed analytics, and teacher dashboards.

### Target Users

- Secondary school students  
- Teachers who want to provide practice quizzes for students  

### Core Features

- **Browse subjects**: Students can select the subject they want to practice.  
- **Take quizzes**: Attempt quizzes based on selected subjects with multiple-choice questions.  
- **View scores**: Get immediate feedback and track performance across quizzes.  

## Technology Stack

- **Backend**: Python / Django  
- **Frontend**: React (Vite)  
- **Database / Data**: JSON  
- **Other**: GitHub Projects for task management, GitHub branch protection for DevOps best practices  

## Getting Started

### Prerequisites

- Python 3.9+  
- Node.js 16+  
- npm or yarn  

### Installation

#### 1. Clone the repository:

```bash
git clone https://github.com/jrwaka/study-link.git
cd study-link
```

#### 2. Backend Setup:

```bash
cd backend
python -m venv venv           # create virtual environment
# Linux / Mac
source venv/bin/activate      
# Windows
# venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

#### 3. Frontend Setup:

```bash
cd frontend
npm install
npm run dev
```

## Usage

Open the frontend in a browser (usually http://localhost:5173/)

Browse subjects, take a quiz, and view your score

## Project Structure

├── backend/          # Django backend
│   ├── manage.py
│   ├── quiz/         # quiz app
│   └── requirements.txt
├── frontend/         # React frontend (Vite)
│   ├── src/
│   ├── index.html
│   └── package.json
├── data/             # sample quiz JSON data
└── README.md

## Links

https://github.com/users/jrwaka/projects/1

## License
MIT License
