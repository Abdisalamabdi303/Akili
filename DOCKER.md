# AI Factory - Docker Setup

## Prerequisites
- Docker and Docker Compose installed
- Ollama running on your host machine (port 11434)

## Quick Start

### 1. Start the services
```bash
docker compose up -d
```

This will:
- Create a PostgreSQL database container
- Initialize the database with required tables
- Build and start the backend API server

### 2. Check logs
```bash
# View all logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# View database logs only
docker compose logs -f postgres
```

### 3. Stop the services
```bash
docker compose down
```

### 4. Stop and remove all data
```bash
docker compose down -v
```

## Configuration

### Environment Variables

**For local development** (`.env`):
- `DB_HOST=localhost` - Database runs on localhost
- `JOB_ENDPOINT=localhost` - Job endpoint host used as `http://<job-endpoint>:11434`

**For Docker** (`.env.docker`):
- `DB_HOST=postgres` - Database container name
- `JOB_ENDPOINT=host.docker.internal` - Access host job endpoint from container

### Ports
- **Backend API**: http://localhost:4000
- **PostgreSQL**: localhost:5432
- **Ollama**: http://localhost:11434 (must be running on host)

## Database Access

Connect to PostgreSQL:
```bash
# Using docker exec
docker exec -it ai-factory-db psql -U aiuser -d ai_factory

# Using psql on host
psql -h localhost -U aiuser -d ai_factory
```

Password: `aipassword`

## Development Workflow

### Run backend locally (without Docker)
```bash
# Make sure PostgreSQL is running via Docker
docker compose up -d postgres

# Run backend on host
node src/server.js
```

### Run everything in Docker
```bash
docker compose up -d
```

## Troubleshooting

### Backend can't connect to Ollama
Make sure Ollama is running on your host machine:
```bash
curl http://localhost:11434/api/tags
```

### Database connection issues
Check if PostgreSQL is healthy:
```bash
docker compose ps
docker compose logs postgres
```

### Reset database
```bash
docker compose down -v
docker compose up -d
```
