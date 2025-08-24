# Kurelen.de

Private Next.js application with Postgres authentication.  
Development is fully containerized via Docker Compose.

---

## Requirements

- [Docker](https://docs.docker.com/get-docker/) (and `sudo` access if your user is not in the `docker` group)
- Node.js 22+ (optional, only needed if you want to run Next.js outside Docker)

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/kurelen/kurelen.de.git
cd kurelen.de
npm install
```

### 2. Environment setup

- Copy .env.example → .env
- Fill in secrets (like `POSTGRES_PASSWORD`)

```bash
cp .env.example .env
```

### 3. Start development stack

```bash
sudo docker compose up -d --build
```

This will start:

- Postgres on port 5432
- Next.js dev server on port 3000
  Open http://localhost:3000

### 4. Logs & commands

```bash
# Follow logs
sudo docker compose logs -f web

# Run a Prisma command inside the web container
sudo docker compose exec web npx prisma --version
```

## Development Workflow

- Code changes in your local folder are **mounted** into the Docker container → hot reload works.
- `node_modules` and `.next` are stored in container volumes for speed and consistency.

### Common scripts

**NPM**

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Storybook
npm run storybook
```

**Make**

```bash
make up          # build + start
make logs        # tail web logs
make ps          # show services
make down        # stop + remove containers (keeps DB)
make down-v      # stop + remove containers + volumes (wipes DB)  ⚠️
make migrate NAME=init
make prisma ARGS="generate"
make psql        # opens psql inside the postgres container
```

## Project structure

- `/src` – Next.js application code
- `/prisma` – Prisma schema and migrations
- `/docker-compose.yml` – Dev services (Next.js, Postgres)
- `/.env.example` – Example environment config
- `/.env` – Local environment config (not in git)
