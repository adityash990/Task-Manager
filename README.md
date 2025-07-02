# Task Manager - Full Stack Application

A modern, full-stack task management application built with Python Flask backend and React TypeScript frontend, containerized with Docker and deployable to Kubernetes.

## 🏗️ Architecture

### Backend (50% Python)
- **Flask REST API** with comprehensive CRUD operations
- **Python 3.11** with modern async capabilities
- **RESTful endpoints** with proper HTTP status codes
- **Input validation** and error handling
- **Health checks** and monitoring endpoints
- **CORS support** for cross-origin requests

### Frontend (50% HTML/CSS/JS)
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, modern styling
- **Lucide React** icons for consistent UI elements
- **Custom hooks** for state management
- **Real-time filtering** and search functionality
- **Responsive design** for all device sizes

## 🚀 Features

### Core Functionality
- ✅ Create, read, update, and delete tasks
- ✅ Task status management (Todo, In Progress, Completed)
- ✅ Priority levels (Low, Medium, High)
- ✅ Due date tracking with overdue indicators
- ✅ Advanced filtering and search
- ✅ Real-time statistics dashboard
- ✅ Responsive design for all devices

### Technical Features
- 🐳 **Docker containerization** for both services
- ☸️ **Kubernetes manifests** for production deployment
- 🔄 **Health checks** and monitoring
- 📊 **Horizontal Pod Autoscaling** (HPA)
- 🔒 **Security best practices** and HTTPS ingress
- 🚀 **Production-ready** configuration

## 📁 Project Structure

```
task-manager/
├── backend/                 # Python Flask API
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container config
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── types/           # TypeScript definitions
│   └── App.tsx          # Main application component
├── k8s/                   # Kubernetes manifests
│   ├── namespace.yaml    # Kubernetes namespace
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ingress.yaml     # Ingress controller config
│   ├── configmap.yaml   # Configuration management
│   └── hpa.yaml         # Horizontal Pod Autoscaler
├── docker-compose.yml    # Multi-container orchestration
├── Dockerfile           # Frontend container config
├── nginx.conf          # Nginx configuration
└── README.md           # This file
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (optional)

### Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Backend setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend setup:**
   ```bash
   npm install
   npm run dev
   ```

4. **Using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

## 🐳 Docker Deployment

### Build and run individual containers:

```bash
# Backend
cd backend
docker build -t task-manager-backend .
docker run -p 5000:5000 task-manager-backend

# Frontend
docker build -t task-manager-frontend .
docker run -p 80:80 task-manager-frontend
```

### Using Docker Compose:
```bash
docker-compose up --build -d
```

## ☸️ Kubernetes Deployment

### Deploy to Kubernetes cluster:

```bash
# Create namespace and deploy all resources
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n task-manager
kubectl get services -n task-manager

# View logs
kubectl logs -f deployment/task-manager-backend -n task-manager
kubectl logs -f deployment/task-manager-frontend -n task-manager
```

### Access the application:
```bash
# Port forward for local access
kubectl port-forward service/task-manager-frontend-service 8080:80 -n task-manager

# Or setup ingress with your domain
# Update k8s/ingress.yaml with your domain name
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
```

**Backend:**
```env
FLASK_ENV=production
PORT=5000
```

### Kubernetes Configuration
- **Namespace:** `task-manager`
- **Backend replicas:** 3 (auto-scaling 2-10)
- **Frontend replicas:** 2 (auto-scaling 2-5)
- **Resource limits:** Configured for production workloads
- **Health checks:** HTTP endpoints for both services

## 📊 API Endpoints

### Task Management
- `GET /api/tasks` - List all tasks (with filtering)
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Statistics & Health
- `GET /api/stats` - Get task statistics
- `GET /health` - Health check endpoint

### Query Parameters
- `status`: Filter by task status
- `priority`: Filter by priority level
- `search`: Search in title and description

## 🔒 Security Features

- **Non-root containers** for enhanced security
- **Resource limits** to prevent resource exhaustion
- **Security headers** via Nginx configuration
- **HTTPS ingress** with TLS termination
- **Input validation** on all API endpoints

## 🚀 Production Considerations

### Scalability
- Horizontal Pod Autoscaling based on CPU/memory usage
- Load balancing across multiple replicas
- Stateless design for easy scaling

### Monitoring
- Health check endpoints for both services
- Kubernetes probes for automated recovery
- Resource usage monitoring

### Performance
- Nginx caching for static assets
- Gzip compression enabled
- Optimized Docker images with multi-stage builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Backend connection issues:**
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check Docker logs
docker-compose logs backend
```

**Frontend build issues:**
```bash
# Clear node modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Kubernetes deployment issues:**
```bash
# Check pod status
kubectl get pods -n task-manager
kubectl describe pod <pod-name> -n task-manager

# Check service connectivity
kubectl port-forward service/task-manager-backend-service 5000:5000 -n task-manager
```

For more help, please open an issue in the repository.