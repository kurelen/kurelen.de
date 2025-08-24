SHELL := /bin/bash
PROJECT := kurelen
DOCKER ?= sudo docker
COMPOSE := $(DOCKER) compose

# --- Host (app) commands ---
host-dev:
	npm run dev

host-gen:
	npx prisma generate

host-migrate:
	@if [ -z "$(NAME)" ]; then echo "Usage: make host-migrate NAME=init"; exit 1; fi
	npx prisma migrate dev --name $(NAME)

host-deploy:
	npx prisma migrate deploy

host-seed:
	npm run db:seed

# --- Docker (DB only) commands ---
db-up:
	$(COMPOSE) up -d postgres

db-down:
	$(COMPOSE) down --remove-orphans

db-logs:
	$(COMPOSE) logs -f postgres

psql:
	$(COMPOSE) exec postgres bash -lc 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'
