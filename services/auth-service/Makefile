.PHONY: help install build start dev test clean docker-build docker-up docker-down docker-logs

# Default target
help:
	@echo "Available commands:"
	@echo "  install      - Install dependencies"
	@echo "  build        - Build the application"
	@echo "  start        - Start the application in production mode"
	@echo "  dev          - Start the application in development mode"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-up    - Start Docker containers"
	@echo "  docker-down  - Stop Docker containers"
	@echo "  docker-logs  - Show Docker logs"

# Install dependencies
install:
	npm install

# Build the application
build:
	npm run build

# Start in production mode
start:
	npm run start:prod

# Start in development mode
dev:
	npm run start:dev

# Run tests
test:
	npm run test

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules

# Docker commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Database commands
db-migrate:
	npm run typeorm migration:run

db-revert:
	npm run typeorm migration:revert

# Development setup
setup: install
	@echo "Setting up development environment..."
	@echo "Copy env.example to .env and update configuration if needed"
	@echo "Run 'make docker-up' to start the services"
	@echo "Run 'make dev' to start the development server"

# Quick start for development
quick-start: docker-up
	@echo "Waiting for services to be ready..."
	@sleep 10
	@echo "Starting development server..."
	make dev
