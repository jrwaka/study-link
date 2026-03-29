# StudyLink

A web platform that helps secondary school students practice quizzes.

**Live Application:** http://4.221.88.111:5173

**Demo Video:** [Watch on YouTube](https://youtu.be/aw9AHtUM3ec)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Infrastructure Setup](#infrastructure-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Running Locally](#running-locally)
- [Team Members](#team-members)

---

## Project Overview

StudyLink is a web application designed to help secondary school students in Rwanda and across Africa prepare for exams. Students can select subjects, attempt quizzes, and immediately see their results to identify areas needing improvement.

### African Context

In many African countries, secondary school students struggle to access past exam papers and revision materials in one centralized location. StudyLink addresses this by providing a simple online platform for students to revise efficiently, track their progress, and improve their learning outcomes.

### Core Features

- Browse subjects and select a topic to practice
- Attempt multiple-choice quizzes
- Get immediate feedback and track performance across quizzes

---

## Architecture
```
                        +-------------------+
                        |   Developer/CI    |
                        |  GitHub Actions   |
                        +--------+----------+
                                 |
                                 | Push to main
                                 v
                    +------------+------------+
                    |     Azure Container     |
                    |   Registry (ACR)        |
                    |  studylinkacr.azurecr.io|
                    +------------+------------+
                                 |
                                 | Ansible pulls image
                                 v
+--------------------------------+--------------------------------+
|                    Azure Virtual Network (VNet)                |
|                         studylink-rg                           |
|                                                                |
|   +-------------------+          +------------------------+   |
|   |   Bastion Host    |          |       App VM           |   |
|   |  (Public Subnet)  | SSH jump |   (Private Subnet)     |   |
|   |  4.221.88.111     +--------->+   10.0.2.4             |   |
|   |                   |          |   Docker + App         |   |
|   +-------------------+          +------------------------+   |
|                                           |                    |
|                                  +--------+-------+           |
|                                  |  Azure PostgreSQL|          |
|                                  |    Database      |          |
|                                  +-----------------+           |
+----------------------------------------------------------------+
```

### How it works

1. A developer pushes code or merges a pull request to the `main` branch
2. GitHub Actions triggers the CD pipeline automatically
3. The pipeline runs all CI checks (lint, tests, security scans)
4. The Docker image is built and pushed to Azure Container Registry
5. Ansible connects to the App VM through the Bastion Host via SSH ProxyJump
6. Ansible pulls the new image from ACR and restarts the container
7. The updated application is live at the public URL

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Python / Django |
| Frontend | React (Vite) |
| Database | Azure Database for PostgreSQL |
| Containerization | Docker / Docker Compose |
| Container Registry | Azure Container Registry (ACR) |
| Cloud Provider | Microsoft Azure |
| Infrastructure as Code | Terraform |
| Configuration Management | Ansible |
| CI/CD | GitHub Actions |

---

## Infrastructure Setup

The entire cloud infrastructure is provisioned using Terraform and stored in the `terraform/` directory.

### Infrastructure Components

- **Azure Virtual Network (VNet)** — private network isolating all resources
- **Bastion Host VM** — small public VM used as a secure SSH jump host
- **App VM** — private VM running the application inside Docker
- **Azure Database for PostgreSQL** — managed database in the private subnet
- **Azure Container Registry (ACR)** — private registry storing Docker images
- **Network Security Groups (NSGs)** — firewall rules controlling traffic

### Provisioning the Infrastructure

#### Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) installed
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- An active Azure subscription

#### Steps
```bash
# Login to Azure
az login

# Navigate to the Terraform directory
cd terraform

# Initialise Terraform
terraform init

# Preview what will be created
terraform plan

# Provision the infrastructure
terraform apply
```

### Configuring the VM with Ansible

Once the infrastructure is provisioned, Ansible configures the App VM by installing Docker and any required packages.

#### Prerequisites

- [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/index.html) installed
- SSH access to the Bastion Host

#### Steps
```bash
# Navigate to the ansible directory
cd ansible

# Run the playbook through the Bastion Host
ansible-playbook -i inventory.ini playbook.yml \
  --private-key ~/.ssh/your_key.pem
```

---

## CI/CD Pipeline

This project uses two GitHub Actions workflows.

### CI Pipeline (`ci.yml`)

Triggers on every pull request to `main` and on pushes to non-main branches.

| Job | Tool | Purpose |
|---|---|---|
| Lint | flake8 | Checks Python code for errors |
| Test | Django test suite | Runs all unit tests |
| IaC Scan | Checkov | Scans Terraform for security issues |
| Docker Build and Scan | Trivy | Builds image and scans for critical CVEs |

The pipeline is configured as a required check — pull requests cannot be merged unless all jobs pass.

### CD Pipeline (`cd.yml`)

Triggers automatically on every merge to `main`.

| Job | Purpose |
|---|---|
| CI Checks | Reruns all CI checks before deploying |
| Build and Push | Builds the Docker image and pushes to ACR |
| Deploy to App VM | Runs Ansible playbook to pull new image and restart the app |

### Required GitHub Secrets

The following secrets must be configured in the repository settings for the pipelines to work:

| Secret | Description |
|---|---|
| `AZURE_CREDENTIALS` | Azure service principal credentials (JSON) |
| `ACR_NAME` | Azure Container Registry name |
| `ACR_LOGIN_SERVER` | ACR login server URL |
| `ACR_USERNAME` | ACR username |
| `ACR_PASSWORD` | ACR password |
| `BASTION_IP` | Public IP of the Bastion Host |
| `VM_IP` | Private IP of the App VM |
| `SSH_PRIVATE_KEY` | Private SSH key for connecting to VMs |
| `VM_PASSWORD` | App VM user password |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL database user |
| `DB_PASSWORD` | PostgreSQL database password |
| `DB_HOST` | PostgreSQL database host |

---

## Running Locally

### With Docker (Recommended)

#### Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

#### Steps
```bash
# Clone the repository
git clone https://github.com/jrwaka/study-link.git
cd study-link

# Start both backend and frontend
docker-compose up --build

# Open in your browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000

# To stop
docker-compose down
```

### Without Docker

#### Prerequisites

- Python 3.9+
- Node.js 16+
- npm

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure
```
study-link/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI pipeline
│       └── cd.yml          # CD pipeline
├── ansible/
│   ├── playbook.yml        # VM configuration playbook
│   └── inventory.ini       # Ansible inventory
├── backend/                # Django backend
│   ├── manage.py
│   ├── quiz/               # Quiz application
│   └── requirements.txt
├── frontend/               # React frontend (Vite)
│   ├── src/
│   └── package.json
├── terraform/              # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Team Members

| Name | Role |
|---|---|
| Junior Rwaka | Infrastructure & Configuration (Terraform + Ansible) |
| Ketia Mukakalisa | DevSecOps & CI Pipeline |
| Mairo Pedro Isaac | CD Pipeline & Deployment |

---

## License

MIT License