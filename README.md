# Kurelen.de

[![CI](https://github.com/kurelen/kurelen.de/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kurelen/kurelen.de/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/kurelen/kurelen.de/branch/main/graph/badge.svg)](https://codecov.io/gh/kurelen/kurelen.de)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?logo=storybook)](https://kurelen.github.io/kurelen.de/)

Private Next.js application for family. Collect and share receipts.

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
make db-up
npm run dev
```

This will start:

- Postgres on port 5432
- Next.js dev server on port 3000
  Open http://localhost:3000

### 4. Logs & commands

```bash
# Follow logs
make db-logs
```

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
make db-up          # build + start postgres
make db-logs        # tail postgres logs
make db-down        # show services
make psql           # opens psql inside the postgres container
```

## Project structure

- `/src` – Next.js application code
- `/prisma` – Prisma schema and migrations
- `/.env.example` – Example environment config
- `/.env` – Local environment config (not in git)
