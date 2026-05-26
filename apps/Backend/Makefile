.PHONY: build up down logs ps shell clean

all: up

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

bash:
	docker compose exec orders-fastapi bash

clean:
	docker compose down -v
