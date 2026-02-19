# Full-Stack Todo Application

This project implements a robust and modern full-stack Todo application, designed to showcase best practices in secure API development, responsive frontend user interfaces, and seamless integration between the two. Users can manage their personal tasks with features like authentication and data isolation, ensuring a personalized and secure experience.

## 🚀 Features

-   **User Authentication**: Secure user registration and login functionality.
-   **Task Management**: Create, read, update, and delete personal tasks.
-   **User Data Isolation (The "Iron Rule")**: Strict enforcement that users can only access or modify their own tasks, ensuring multi-tenancy security.
-   **Responsive User Interface**: Built with Next.js and Tailwind CSS for a fluid experience across devices.
-   **Consistent API Error Handling**: Standardized JSON error responses for all API failures, improving client-side error management.
-   **Structured Logging**: Backend logging in JSON format for enhanced observability and debugging in production environments.
-   **Frontend/Backend Type Synchronization**: Automated generation of TypeScript interfaces from Pydantic models to maintain type safety across the entire stack.
-   **Health Check Endpoint**: A dedicated endpoint for monitoring backend and database connectivity.

## 💻 Technologies Used

### Backend
-   **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.8+.
-   **SQLModel**: A library for interacting with SQL databases, combining the best of SQLAlchemy and Pydantic.
-   **Uvicorn**: An ASGI server for running FastAPI applications.
-   **Pydantic-settings**: For managing application settings and environment variable validation.
-   **PyJWT**: For JSON Web Token (JWT) authentication and verification.
-   **Python-JSON-Logger**: For structured JSON logging.
-   **Asyncpg**: Asynchronous PostgreSQL driver (though SQLite is used for local development).
-   **Alembic**: Database migration tool for managing schema changes.

### Frontend
-   **Next.js**: A React framework for building full-stack web applications, utilizing the App Router.
-   **React**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Tailwind CSS**: A utility-first CSS framework for rapidly styling web applications.
-   **Shadcn/UI**: Reusable components for React, built with Tailwind CSS and Radix UI.
-   **Zod**: A TypeScript-first schema declaration and validation library, used for client-side form validation.
-   **Zustand**: A small, fast, and scalable bear-necessities state-management solution.
-   **Sonner**: A toast library for displaying notifications.

### Development Tools
-   **UV**: A fast Python package installer and resolver.
-   **Pydantic2ts**: Tool for generating TypeScript interfaces from Pydantic models.
-   **json-schema-to-typescript**: Command-line tool used by `pydantic2ts` to convert JSON schemas to TypeScript.

## 🚀 Getting Started

To get this project up and running on your local machine, follow these steps:

### Prerequisites

-   Node.js (v18.x or later)
-   npm (v8.x or later)
-   Python (v3.10 or later)
-   uv (Python package manager)

### 1. Clone the repository

```bash
git clone <repository_url>
cd Hackathon-Todo
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Create a Python virtual environment and install dependencies using `uv`:

```bash
uv venv
uv pip install -e .
uv pip install pydantic-to-typescript
uv pip install PyJWT click h11 starlette python-dotenv annotated-doc sqlalchemy
```

Generate a `.env` file with necessary environment variables:

```bash
cp .env.example .env # (If .env.example exists, otherwise create it manually)
```

Edit the `.env` file and set your database URL, CORS origins, and Better Auth secret:

```ini
DATABASE_URL="sqlite+aiosqlite:///./test.db"
ALEMBIC_DATABASE_URL="sqlite+aiosqlite:///./test.db"
CORS_ORIGINS=["http://localhost:3000"]
BETTER_AUTH_SECRET="your_super_secret_key"
```

Run database migrations:

```bash
./.venv/bin/alembic upgrade head
```

Run the seeding script to populate test data:

```bash
PYTHONPATH=. ./.venv/bin/python scripts/seed.py
```

Start the backend server:

```bash
./.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Generate TypeScript types from backend models:

```bash
# From the project root, assuming backend is at ../backend/ and frontend is at ./
PYTHONPATH=. ../backend/.venv/bin/pydantic2ts --module backend.app.models.models --output src/types/schemas.ts --json2ts-cmd ./node_modules/.bin/json2ts
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will be accessible at `http://localhost:3000`.

## 🧪 Testing

### Backend API Testing

Access the API documentation at `http://127.0.0.1:8000/docs` or `http://127.0.0.1:8000/redoc` to test the endpoints.

### 'Iron Rule' Security Audit

To verify user data isolation, run the automated security audit script:

```bash
# Ensure your backend is running and replace placeholders
export API_URL="http://127.0.0.1:8000"
export TOKEN_USER_A="<JWT_TOKEN_FOR_USER_A>" # Get this from frontend login
export TASK_ID_USER_B="<ID_OF_A_TASK_BELONGING_TO_USER_B>" # Seeded by scripts/seed.py

./scripts/run-security-audit.sh
```

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ☸️ Phase 4: Local Kubernetes Deployment (Minikube)

In this phase, we moved the application from a simple local process to a production-grade Kubernetes cluster running locally on **Minikube**.

### 1. Why Kubernetes?
Unlike running `npm run dev` or `uvicorn`, Kubernetes (K8s) manages the "lifecycle" of your app. If a container crashes, K8s restarts it. It also handles internal routing (Ingress), secret management, and security policies (non-root users) out of the box.

### 2. The "Last Mile" Challenge
Since the app is running *inside* a virtualized cluster, your browser on the host machine doesn't know how to find it. We solve this with two steps:
1.  **Local DNS**: Mapping `todo.local` to the cluster's IP.
2.  **Network Tunnel**: Creating a bridge between your machine and the cluster's internal network.

### 3. Step-by-Step Guide

#### **Prerequisites**
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed.
- [Helm](https://helm.sh/docs/intro/install/) installed.
- Addons enabled: `minikube addons enable ingress metrics-server`.

#### **A. Point Docker to Minikube**
Before building images, tell your terminal to use Minikube's internal Docker daemon. This avoids the need to push images to the cloud.
```bash
eval $(minikube docker-env)
```

#### **B. Build the Images**
```bash
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
```

#### **C. Set up Secrets**
Create `kubernetes/helm/todo-app/secrets.yaml` (this file is git-ignored for safety):
```yaml
secrets:
  DATABASE_URL: "your-neon-db-url"
  BETTER_AUTH_SECRET: "your-auth-secret"
  GROQ_API_KEY: "your-groq-key"
```

#### **D. Deploy with Helm**
Helm is the "Package Manager" for Kubernetes. It installs all components (Backend, Frontend, Ingress, Secrets) in one command:
```bash
helm upgrade --install todo-app ./kubernetes/helm/todo-app --values ./kubernetes/helm/todo-app/secrets.yaml
```

#### **E. Connectivity (Crucial)**
1.  **Get Cluster IP**: Run `minikube ip` (e.g., `192.168.49.2`).
2.  **Update Hosts**: Add the IP to your hosts file:
    - **Linux/WSL**: `sudo nano /etc/hosts` -> add `192.168.49.2 todo.local`
    - **Windows**: Edit `C:\Windows\System32\drivers\etc\hosts` (as Admin).
3.  **Start Tunnel**: **Open a new terminal** and run:
    ```bash
    minikube tunnel
    ```
    *Keep this running while you use the app.*

### 4. Verification
Once deployed, you can verify the setup with the automated script:
```bash
./scripts/k8s/verify-deployment.sh
```
Or manually:
- **Frontend**: Visit [http://todo.local](http://todo.local)
- **Backend Health**: Visit [http://todo.local/api/health](http://todo.local/api/health)

### 5. Troubleshooting
- **503 Service Unavailable**: The pods are still starting up or the database connection is slow. Wait 30 seconds.
- **Connection Refused**: Ensure `minikube tunnel` is active.
- **ImagePullBackOff**: You forgot to run `eval $(minikube docker-env)` before building your images.
