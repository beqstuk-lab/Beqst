# Beqst - Digital Estate Planning Platform

Beqst is a comprehensive digital estate planning platform designed specifically for the UK market.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Containerization**: Docker (Multi-stage build)

## Getting Started

### Prerequisites
- Docker & Docker Compose
- (Optional) Node.js 20+ for local dev

### Using Docker (Recommended)

The application is fully containerized. To start it:

```bash
docker-compose up --build
```

Access the application at [http://localhost:3000](http://localhost:3000).

The environment includes:
- **Web**: Next.js application
- **DB**: PostgreSQL 15
- **Redis**: Redis (for queues/caching)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

The Dockerfile is optimized for production using Next.js Standalone mode.

```bash
docker build -t beqst:latest .
docker run -p 3000:3000 beqst:latest
```
