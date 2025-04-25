# API Gateway para Reserva de Hoteles

API Gateway implementado con Apollo Server, GraphQL y Express para la aplicación de reserva de hoteles.

## Requisitos

- Node.js (v14 o superior)
- npm

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Crear archivo .env basado en .env.example
4. Iniciar en modo desarrollo: `npm run dev`

## Estructura del proyecto

- `/src`: Código fuente
  - `/typeDefs`: Definiciones de tipos GraphQL
  - `/resolvers`: Resolvers para GraphQL
  - `/middlewares`: Middlewares para autenticación y otros
  - `/utils`: Utilidades

## API GraphQL

La API GraphQL está disponible en: `http://localhost:4000/graphql`
