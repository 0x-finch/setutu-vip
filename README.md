# Setutu API

## Local development

```bash

    # git clone
    git clone https://github.com/guiyumin/setutu-api.git
    # go to the directory
    cd setutu-api
    # setup env vars
    cp .env.example .env
    # run it locally
    make dev
    # go to localhost:8000 for the web, localhost:9000 for the api
    # or,
    # go to https://www.setutu.vip for the web,
    # go to https://www.setutu.vip/server/  for the api
```

## API Service

### `base url`

- `localhost:9000/v1`
- `https://www.setutu.vip/server/v1`

### POST `/public/api-sign-up`

```json
// payload
{
  "email": "a@a.com",
  "password": "hello123"
}
```

### POST `/public/api-sign-in`

```json
// payload
{
  "email": "a@a.com",
  "password": "hello123"
}
```

### GET `/api/images`

```json
// header
{
  "Cotent-Type": "application/json",
  "x-setutu-api-token": "jwt token"
}
```
