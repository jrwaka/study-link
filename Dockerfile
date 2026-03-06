FROM python:3.12-slim

# Prevent Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Prevent Python from buffering and the output is sent to the terminal
ENV PYTHONUNBUFFERED=1

# Set the working directory for the backend
WORKDIR /app

# Copy the requirements file
COPY backend/requirements.txt /app/

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files into the container

COPY backend/ .

# Create a non-root user for security

RUN useradd -m appuser && chown -R appuser /app

USER appuser

# Expose port 8000

EXPOSE 8000

# Run the application

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]