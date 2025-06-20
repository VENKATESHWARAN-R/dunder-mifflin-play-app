# Makefile for Subscription POC App (Docker Compose)

.PHONY: up down logs build restart

up:
	docker-compose up --build

down:
	docker-compose down -v

logs:
	docker-compose logs -f

build:
	docker-compose build

restart:
	docker-compose down -v && docker-compose up --build
