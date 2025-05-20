.PHONY: i dev dev-web dev-server build build-web build-server d-up d-stop d-down d-clean

i:
	pnpm install

dev: i
	$(MAKE) -j2 dev-web dev-server

dev-web:
	pnpm exec dotenv -e .env -- pnpm --filter web dev

dev-server:
	pnpm exec dotenv -e .env -- pnpm --filter server dev

build: 
	$(MAKE) -j2 build-web build-server

build-web:
	pnpm --filter web build

build-server:
	pnpm --filter server build
 
d-up:
	docker compose up -d

d-stop:
	docker compose stop

d-down:
	docker compose down

# Warning: Deletes all Docker resources
d-clean:
	docker compose down -v --rmi all --remove-orphans
 

 