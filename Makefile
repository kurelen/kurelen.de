# Makefile for kurelen (Docker Compose dev workflow)

SHELL := /bin/bash
PROJECT := kurelen

# Use sudo by default; override with: make DOCKER=docker up
DOCKER ?= sudo docker
COMPOSE := $(DOCKER) compose

UID := $(shell id -u)
GID := $(shell id -g)
EXEC_USER := -u $(UID):$(GID)

.DEFAULT_GOAL := help

.PHONY: up down down-v restart logs logs-all ps sh psql prisma migrate db-push \
        reset-app-volumes clean help

## Build images and start containers in the background
up:
	$(COMPOSE) up -d --build

## Stop and remove containers and network (keeps named volumes)
down:
	$(COMPOSE) down --remove-orphans

## Stop and remove EVERYTHING including named volumes (⚠️ wipes DB data)
down-v:
	$(COMPOSE) down -v --remove-orphans

## Restart stack (down + up)
restart:
	$(MAKE) down
	$(MAKE) up

## Tail logs from the web service
logs:
	$(COMPOSE) logs -f web

## Tail logs from all services
logs-all:
	$(COMPOSE) logs -f

## Show running services
ps:
	$(COMPOSE) ps

## Shell into the web container
sh:
	$(COMPOSE) exec web sh

## Open psql inside the postgres container (uses env from the container)
psql:
	$(COMPOSE) exec postgres bash -lc 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

# prisma generate (root)
prisma-gen:
	$(COMPOSE) exec web npx prisma generate

## Run Prisma with custom args: make prisma ARGS="studio --port 5555 --browser none"
prisma:
	$(COMPOSE) exec web npx prisma $(ARGS)

## Run Prisma migrate dev with a name: make migrate NAME=init
migrate:
	@if [ -z "$(NAME)" ]; then echo "Usage: make migrate NAME=init"; exit 1; fi
	$(COMPOSE) exec $(EXEC_USER) web npx prisma migrate dev --name $(NAME)

## Push Prisma schema without creating a migration
db-push:
	$(COMPOSE) exec $(EXEC_USER) web npx prisma db push

fix-perms:
	sudo chown -R $(UID):$(GID) .

# one-time helper to fix perms on volumes
vol-perms:
	$(COMPOSE) exec web sh -lc 'chown -R $(UID):$(GID) /app/node_modules /app/.next 2>/dev/null || true'

## Remove app-only volumes (node_modules, .next) to fix caching/permissions
reset-app-volumes:
	-$(COMPOSE) stop web
	-$(COMPOSE) rm -f web
	-$(DOCKER) volume rm $(PROJECT)_node_modules $(PROJECT)_next_cache

## Clean stack (down + reset app volumes; keeps DB volume)
clean:
	$(MAKE) down
	$(MAKE) reset-app-volumes

## Show this help
help:
	@echo "Usage: make <target> [DOCKER=docker]"
	@echo
	@awk 'BEGIN {FS = ":.*## "}; /^[a-zA-Z0-9_-]+:.*## / { printf "\033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
