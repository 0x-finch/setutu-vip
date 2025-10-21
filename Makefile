.PHONY: install dev build d-up d-stop d-down d-clean

install:
	cd apps/web && npm install

dev:
	cd apps/web && npm run dev

build:
	cd apps/web && npm run build

d-up:
	docker compose up -d

d-stop:
	docker compose stop

d-down:
	docker compose down

# Warning: Deletes all Docker resources
d-clean:
	docker compose down -v --rmi all --remove-orphans