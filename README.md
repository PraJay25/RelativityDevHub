# RelativityDevHub

RelativityDevHub: A comprehensive collection of development tools, extensions, and integrations tailored for Relativity and eDiscovery platforms. Aimed at enhancing workflow efficiency, this hub provides developers and eDiscovery professionals with resources to optimize and innovate within the Relativity environment.

## 🏗️ Microservices Architecture

This project implements a robust microservices architecture designed for high scalability, reliability, and maintainability in eDiscovery environments.

### 🎯 **Business Domain: "Relativity-lite" eDiscovery Platform**

**Target Market**: Solo/small-firm litigators and internal compliance teams who need first-pass review of modest datasets without full Relativity licensing.

**Core Workflow**:

1. User uploads container (ZIP/PST)
2. System explodes containers, extracts text and metadata
3. NLP classifier scores docs for privilege likelihood + detects PII entities
4. Reviewer UI shows hits in real-time; reviewers add tags/comments
5. Export engine produces redacted PDF bundle + CSV hit report

### 🏛️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   Ingest API    │    │   Review API    │
│   (Rate Limiting│    │   (Container    │    │   (WebSocket    │
│   & Auth)       │    │   Processing)   │    │   Feed)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
    ┌─────────────────────────────────────────────────────────────┐
    │                    Worker Services                         │
    │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
    │  │   Ingest    │ │    NLP      │ │   Export    │ │Notification│ │
    │  │   Worker    │ │   Worker    │ │   Worker    │ │ Service  │ │
    │  │  (Tika)     │ │ (DistilBERT)│ │ (PDF/CSV)   │ │ (Email)  │ │
    │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
    └─────────────────────────────────────────────────────────────┘
                                 │
    ┌─────────────────────────────────────────────────────────────┐
    │                    Infrastructure Layer                     │
    │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
    │  │ PostgreSQL  │ │    Redis    │ │   BullMQ    │ │  JWT    │ │
    │  │  (Primary   │ │  (Caching & │ │  (Job Queue │ │ (Auth)  │ │
    │  │   Database) │ │   Sessions) │ │   & Comm)   │ │         │ │
    │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
    └─────────────────────────────────────────────────────────────┘
```

### 🛠️ Technology Stack

#### Core Framework

- **NestJS** - Progressive Node.js framework for building scalable server-side applications
- **TypeScript** - Type-safe JavaScript for better development experience

#### Data Layer

- **PostgreSQL** - Primary relational database with TypeORM
- **Redis** - Distributed caching and session management
- **TypeORM** - Object-Relational Mapping for database operations

#### Communication & Queues

- **BullMQ** - Job queue and inter-service communication
- **JWT** - Service-to-service authentication and authorization

#### Infrastructure

- **API Gateway** - Rate limiting, load balancing, and request routing
- **Docker** - Containerization for consistent deployment
- **Kubernetes** - Orchestration and scaling
- **Istio** - Service mesh for traffic management and security

#### Observability

- **Centralized Logging** - ELK Stack (Elasticsearch, Logstash, Kibana)
- **Monitoring** - Prometheus and Grafana
- **Distributed Tracing** - Jaeger or Zipkin
- **Health Checks** - Circuit breakers and service discovery

### 📊 **Scale Requirements**

#### POC Target

- ≤ 10 concurrent users
- ≤ 5 parallel ingests
- Each ingest ≤ 50,000 docs (≈ 8 GB text)
- Throughput goal: 2–3 docs/sec/classifier on a 4-core laptop

#### Rate Limits (enforced at API Gateway)

- `POST /jobs` → max 10 per hour
- WebSocket messages → burst 100/s, sustained 20/s per connection
- REST fetch (`GET /docs/…`) → 15 req/s per user

#### Production Planning

- 2k rps read, 100 ingest jobs/hr, millions of docs
- Horizontal scaling with dedicated nodes for BullMQ workers and PostgreSQL

### 📋 Service Architecture

#### Core Services

1. **API Gateway Service** - Rate limiting, JWT verification, request routing
2. **Ingest API Service** - Accept uploads, explode containers, create jobs
3. **Ingest Worker Service** - Tika extraction → store text → enqueue NLP job
4. **NLP Worker Service** - Run DistilBERT, detect PII → update doc rows
5. **Review API Service** - Serve docs, tags, WebSocket feed
6. **Export Worker Service** - Build redacted PDFs / CSV report
7. **Notification Service** - Send emails/Slack when job done

#### Infrastructure Services

- **Authentication Service** - JWT token management and user authentication
- **User Management Service** - User profiles and permissions
- **External Connector Service** - Integration with Relativity RSAPI and other eDiscovery tools

### 🔒 Security Features

- JWT-based authentication with HS256 shared secret
- Row Level Security (RLS) with tenant isolation
- Rate limiting and DDoS protection
- Input validation and sanitization
- CORS configuration
- Secure headers
- API key management
- Audit logging with SOC2 compliance

### 📊 Monitoring & Observability

- **Metrics Collection** - Prometheus metrics
- **Log Aggregation** - Centralized logging with ELK stack
- **Distributed Tracing** - Request tracing across services
- **Health Monitoring** - Service health checks and alerts
- **Performance Monitoring** - Response time and throughput metrics

### 🐳 Deployment

#### POC Environment (Docker Compose)

- **postgres 15**: 1 GB RAM, volume `./pgdata`
- **redis 7**: 128 MB max-memory policy `allkeys-lru`
- **tika-server**: Sidecar for Ingest Service
- **api-gateway**: Traefik or Kong in "DB-less" mode
- **nest-svc-\***: Each in its own container
- **bull-worker**: Executes NLP + PDF redaction jobs

#### Production Environment

- **Kubernetes** (EKS/AKS/GKE) with Istio sidecars
- **Node pools**: "cpu-general" vs. "gpu-bert"
- **External S3** or MinIO for object storage
- **Redis Cluster** + RDS PostgreSQL with logical replication

### 📁 Project Structure

```
RelativityDevHub/
├── services/                    # Microservices
│   ├── gateway/                # API Gateway (Traefik/Kong)
│   ├── ingest-api/             # Ingest API service
│   ├── ingest-worker/          # Ingest worker service
│   ├── nlp-worker/             # NLP processing service
│   ├── review-api/             # Review API service
│   ├── export-worker/          # Export worker service
│   ├── notification-service/   # Notification service
│   ├── auth-service/           # Authentication service
│   └── user-service/           # User management service
├── infrastructure/             # Infrastructure configuration
│   ├── docker/                 # Docker configurations
│   │   ├── docker-compose.yml # POC development stack
│   │   └── Dockerfile.*        # Service-specific Dockerfiles
│   ├── kubernetes/             # K8s manifests
│   ├── monitoring/             # Monitoring setup
│   └── scripts/                # Deployment scripts
├── shared/                     # Shared libraries and utilities
│   ├── common/                 # Common utilities
│   ├── types/                  # Shared TypeScript types
│   └── middleware/             # Shared middleware
├── docs/                       # Documentation
│   ├── api/                    # OpenAPI specifications
│   ├── architecture/           # Architecture documentation
│   └── deployment/             # Deployment guides
└── tests/                      # Integration and E2E tests
```

### 🗄️ Database Schema (PostgreSQL)

#### Core Tables

- **tenants** - Multi-tenant support (future RLS pivot)
- **users** - User accounts and roles
- **ingest_jobs** - Job state machine with JSONB progress column
- **documents** - Document metadata and text excerpts (4KB cap)
- **pii_entities** - JSONB array per doc with GIN index
- **review_actions** - Tags/comments with quartile timestamps
- **audit_log** - SOC2 compliance with 90-day retention

#### Estimated Storage (POC)

- 50,000 docs × 2KB ≈ 100MB (metadata) + raw natives on disk

### 🔄 Development Workflow

1. **Local Development** - `make dev` brings up Docker Compose stack
2. **Testing** - Unit, integration, and E2E tests
3. **CI/CD** - Automated testing and deployment pipeline
4. **Monitoring** - Real-time monitoring and alerting

### 📚 Documentation

- [API Documentation](docs/api/openapi.yaml)
- [Architecture Guide](docs/architecture/README.md)
- [Deployment Guide](docs/deployment/README.md)
- [Development Guide](docs/development/README.md)
- [Troubleshooting](docs/troubleshooting/README.md)

### 🚀 Getting Started

#### Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm
- PostgreSQL 15 (for local development)

#### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd RelativityDevHub

# Start the development stack
make dev

# Watch worker logs
docker compose logs -f worker

# Access services
# - API Gateway: http://localhost:8080
# - BullMQ Dashboard: http://localhost:3001
# - PostgreSQL: localhost:5432
```

### 🎯 **Immediate Next Steps**

1. **Design OpenAPI 3.1 spec** for core endpoints:

   - `POST /api/v1/jobs`
   - `GET /jobs/{id}`
   - `GET /doc/{id}`
   - `WS /stream/{jobId}`

2. **Create core database tables** with Row Level Security enabled

3. **Set up Docker Compose stack** with Gateway, PostgreSQL, Redis, Ingest API, BullMQ dashboard

4. **Seed with sample data** (Enron corpus) and verify end-to-end workflow

5. **Production backlog** planning for GPU nodes, external object store, connector microservice, SOC2 evidence collection

### 🤝 Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_RelativityDevHub: Bringing enterprise-grade eDiscovery capabilities to small firms and solo practitioners._
