# Documentación del Schema GraphQL - Hotel Booking API

Este documento proporciona una visión completa del schema GraphQL utilizado en el API Gateway de la aplicación de reserva de hoteles.

## Tipos Principales

### Autenticación y Usuarios
- **User**: Usuario registrado en el sistema.
- **Role**: Rol que define los permisos del usuario (ADMIN, USER, HOTEL_MANAGER).
- **People**: Información personal de un usuario (nombre, apellido, teléfono).
- **AuthPayload**: Respuesta de autenticación (token, refreshToken, información de usuario).

### Ubicaciones y Categorías
- **Country**: Información de país (nombre, código).
- **City**: Información de ciudad asociada a un país.
- **Address**: Dirección física asociada a una ciudad.
- **Category**: Categoría de hotel (estrellas, descripción).

### Hoteles y Habitaciones
- **Hotel**: Información completa de un hotel.
- **Room**: Habitación de hotel con detalles de capacidad, precio, etc.
- **Rating**: Calificación otorgada a un hotel por un usuario.

### Reservas
- **Booking**: Reserva de una habitación por un usuario.
- **BookingStatus**: Estado de una reserva (PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA).

## Relaciones Clave

- **User → People**: Un usuario tiene una información personal asociada.
- **Hotel → Address**: Un hotel tiene una dirección física.
- **Hotel → Category**: Un hotel pertenece a una categoría.
- **Hotel → Room**: Un hotel tiene múltiples habitaciones.
- **Hotel → Rating**: Un hotel puede tener múltiples calificaciones.
- **Room → Hotel**: Una habitación pertenece a un hotel.
- **Booking → Room**: Una reserva está asociada a una habitación.
- **Booking → User**: Una reserva pertenece a un usuario.

## Consultas (Queries)

### Autenticación
- `me: User`: Obtiene información del usuario autenticado.
- `validateToken(token: String!): Boolean!`: Valida un token JWT.

### Información Personal
- `getPeopleInfo: People`: Obtiene información personal del usuario actual.
- `getPeopleByUserId(userId: ID!): People`: Obtiene información personal por ID de usuario (solo ADMIN).
- `getAllPeople: [People!]!`: Lista toda la información personal (solo ADMIN).

### Hoteles
- `getHoteles(filter: HotelFilterInput): [Hotel]!`: Obtiene lista de hoteles con filtros opcionales.
- `getHotelById(id: ID!): Hotel`: Obtiene un hotel específico por ID.
- `getHotelesDestacados(limit: Int): [Hotel]!`: Obtiene hoteles destacados para mostrar en la página principal.

### Habitaciones
- `getRoomsByHotelId(hotelId: ID!, filter: RoomFilterInput): [Room]!`: Obtiene habitaciones de un hotel con filtros opcionales.
- `getRoomById(id: ID!): Room`: Obtiene habitación por ID.
- `checkRoomAvailability(id: ID!, fechaEntrada: String!, fechaSalida: String!): Boolean!`: Verifica disponibilidad de una habitación para fechas específicas.

### Reservas
- `getUserBookings(filter: BookingFilterInput): [Booking]!`: Obtiene reservas del usuario autenticado.
- `getBookingById(id: ID!): Booking`: Obtiene una reserva específica por ID.
- `getHotelBookings(hotelId: ID!, filter: BookingFilterInput): [Booking]!`: Obtiene reservas de un hotel (solo ADMIN o HOTEL_MANAGER).

## Mutaciones (Mutations)

### Autenticación
- `register(input: RegisterInput!, peopleInput: PeopleInput!): AuthPayload!`: Registra un nuevo usuario con información personal.
- `login(input: LoginInput!): AuthPayload!`: Inicia sesión de usuario.
- `refreshToken(input: RefreshTokenInput!): AuthPayload!`: Refresca un token caducado.
- `logout: Boolean!`: Cierra sesión (invalida tokens).
- `changePassword(input: ChangePasswordInput!): Boolean!`: Cambia la contraseña del usuario.

### Información Personal
- `updatePeopleInfo(input: PeopleInput!): People!`: Actualiza información personal del usuario autenticado.

### Habitaciones
- `createRoom(input: RoomInput!): Room!`: Crea una nueva habitación (solo ADMIN o HOTEL_MANAGER).
- `updateRoom(id: ID!, input: RoomInput!): Room!`: Actualiza una habitación existente (solo ADMIN o HOTEL_MANAGER).
- `deleteRoom(id: ID!): Boolean!`: Elimina una habitación (solo ADMIN o HOTEL_MANAGER).
- `updateRoomAvailability(id: ID!, disponibilidad: Boolean!): Room!`: Actualiza disponibilidad de una habitación (solo ADMIN o HOTEL_MANAGER).

### Reservas
- `createBooking(input: BookingInput!): Booking!`: Crea una nueva reserva.
- `updateBookingStatus(id: ID!, estado: BookingStatus!): Booking!`: Actualiza estado de reserva (solo ADMIN o HOTEL_MANAGER).
- `cancelBooking(id: ID!): Booking!`: Cancela una reserva propia.

## Inputs y Filtros

### Autenticación
- `RegisterInput`: Datos para registro de usuario (email, password, etc.).
- `LoginInput`: Credenciales para inicio de sesión.
- `RefreshTokenInput`: Token de refresco para renovar token JWT.
- `ChangePasswordInput`: Contraseñas antigua y nueva para cambio.

### Información Personal
- `PeopleInput`: Datos personales (nombre, apellido, teléfono).

### Hoteles
- `HotelFilterInput`: Filtros para búsqueda de hoteles (ciudad, fechas, categoría, etc.).

### Habitaciones
- `RoomInput`: Datos para crear/actualizar habitaciones.
- `RoomFilterInput`: Filtros para búsqueda de habitaciones (fechas, capacidad, precio).

### Reservas
- `BookingInput`: Datos para crear una reserva.
- `BookingFilterInput`: Filtros para búsqueda de reservas (estado, fechas).

## Directivas

- `@auth`: Protege campos o mutaciones que requieren autenticación.
- `@hasRole(role: [UserRole!]!)`: Protege campos o mutaciones que requieren roles específicos.

## Ejemplos de Uso

### Consultar Hoteles Destacados
```graphql
query GetHotelesDestacados {
  getHotelesDestacados(limit: 5) {
    id
    nombre
    descripcion
    imagenes
    calificacionPromedio
    categoria {
      nombre
      estrellas
    }
    direccion {
      calle
      city {
        nombre
        country {
          nombre
        }
      }
    }
  }
}
```

### Buscar Habitaciones Disponibles
```graphql
query BuscarHabitaciones($hotelId: ID!, $filter: RoomFilterInput) {
  getRoomsByHotelId(hotelId: $hotelId, filter: $filter) {
    id
    tipo
    capacidad
    precio
    descripcion
    imagenes
    amenities
    disponible
  }
}
```

### Crear una Reserva
```graphql
mutation CrearReserva($input: BookingInput!) {
  createBooking(input: $input) {
    id
    habitacion {
      id
      tipo
      hotel {
        nombre
      }
    }
    fechaEntrada
    fechaSalida
    estado
    precioTotal
  }
}
```

## Diagrama de Relaciones
```
User ─┬─ Role
      └─ People
      
Hotel ─┬─ Address ─┬─ City ─── Country
       ├─ Category
       ├─ Room ──── Booking ─── User
       └─ Rating ─── User
```