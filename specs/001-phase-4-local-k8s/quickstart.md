# Quickstart: Phase 4 Local Kubernetes

## Prerequisites
- Docker Desktop (Running)
- Minikube (`minikube start --driver=docker`)
- Helm 3+ (`brew install helm`)
- `kubectl`

## 1. Prepare Environment
```bash
# Enable addons
minikube addons enable ingress
minikube addons enable metrics-server

# Switch to Minikube Docker Registry
eval $(minikube docker-env)
```

## 2. Build Images
```bash
# Build Backend
docker build -t todo-backend:latest ./backend

# Build Frontend
docker build -t todo-frontend:latest ./frontend
```

## 3. Create Secrets
```bash
# Create secret from local .env (ensure .env exists first!)
kubectl create secret generic todo-app-secrets 
  --from-env-file=.env
```

## 4. Deploy
```bash
# Install Chart
helm install todo-app ./kubernetes/helm/todo-app

# Watch Pods
kubectl get pods -w
```

## 5. Configure Host
```bash
# Add to /etc/hosts (requires sudo)
echo "$(minikube ip) todo.local" | sudo tee -a /etc/hosts
```

## 6. Access
Open http://todo.local in your browser.
