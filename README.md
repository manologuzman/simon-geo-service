<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Microservicio de auditoría

El microservicio de Geolocalización :

Este servicio forma parte de una arquitectura de microservicios para un sistema de monitoreo y control de flotas, y actúa servicio de geolocalización.

Está construido con NestJS.

## Características

- Recibe datos GPS (HTTP POST) y los almacena en Redis (TTL: 5 minutos). 
- Implementar un mecanismo de duplicación para evitar registros duplicados si un vehículo envía la misma coordenada múltiples veces. 
- Validación de datos mediante DTOs y class-validator.
- Swagger API Documentation.
- Persistencia en PostgreSQL usando Prisma ORM.

## Requisitos

- Node.js (v16 o superior)
- npm
- Docker y Docker Compose (para la versión containerizada)

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL_SECONDS=300
PORT=3001
ROUTING_SERVICE_URL=http://routing-service:3002
AUDIT_SERVICE_URL=http://audit-service:3003

```

## Download the repository

```bash
$
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deployment

## Endpoints

### Audit Alerts

```
POST /geo
```

**Parámetros de consulta:**

```bash
{
    "deviceId": "AZD-223",
    "origin": {
        "lat": 5.5225,
        "lng": 8.2225
    },
    "destination": {
        "lat": 4.1225,
        "lng": 10.1225
    }
}
```

**Respuesta:**

```bash
{
    "status": "success",
    "data": {
        "saved": true,
        "route": {
            "deviceId": "GaD-223",
            "origin": {
                "lat": 55.5225,
                "lng": 85.2225
            },
            "destination": {
                "lat": 22.1225,
                "lng": 49.1225
            },
            "route": [
                {
                    "lat": 38.8225,
                    "lng": 67.1725
                }
            ],
            "status": "success",
            "cacheTTL": 300
        }
    }
}
```

## Documentación API

La documentación de la API está disponible en Swagger UI:

http://localhost:3001/api/docs

La documentación de la API está disponible en CompoDoc UI:

http://localhost:3001/docs/

Incluye:

Tags por módulo (Alert)
Ejemplos de payloads

## Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas con cobertura
npm run test:cov
```
