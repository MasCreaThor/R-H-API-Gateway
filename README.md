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

## Esquema GraphQL

El API Gateway utiliza GraphQL para proporcionar una interfaz unificada para todos los microservicios. El esquema GraphQL incluye:

### Autenticación y Usuarios

- `register`: Registra un nuevo usuario con información personal
- `login`: Autentica a un usuario y devuelve tokens
- `refreshToken`: Renueva un token de acceso
- `me`: Obtiene información del usuario autenticado
- `validateToken`: Verifica si un token es válido

### Información Personal

- `getPeopleInfo`: Obtiene información personal del usuario
- `updatePeopleInfo`: Actualiza información personal

### Hoteles

- `getHoteles`: Obtiene lista de hoteles, con opciones de filtrado
- `getHotelById`: Obtiene detalles de un hotel específico
- `getHotelesDestacados`: Obtiene hoteles destacados para la página principal

### Habitaciones

- `getRoomsByHotelId`: Obtiene habitaciones de un hotel
- `getRoomById`: Obtiene detalles de una habitación
- `checkRoomAvailability`: Verifica disponibilidad en fechas específicas
- `createRoom`: Crea una nueva habitación (HOTEL_MANAGER)
- `updateRoom`: Actualiza información de una habitación (HOTEL_MANAGER)
- `deleteRoom`: Elimina una habitación (HOTEL_MANAGER)

### Reservas

- `getUserBookings`: Obtiene reservas del usuario actual
- `getBookingById`: Obtiene detalles de una reserva
- `getHotelBookings`: Obtiene reservas de un hotel (HOTEL_MANAGER)
- `createBooking`: Crea una nueva reserva
- `updateBookingStatus`: Actualiza el estado de una reserva
- `cancelBooking`: Cancela una reserva

Probar estas consultas en Apollo Studio, accesible en `http://localhost:4000/graphql`
