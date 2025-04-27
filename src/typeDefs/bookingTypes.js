import { gql } from 'apollo-server-express';

const bookingTypes = gql`
  # Tipo para reservas
  type Booking {
    id: ID!
    userId: ID!
    habitacionId: ID!
    habitacion: Room
    fechaEntrada: String!
    fechaSalida: String!
    estado: BookingStatus!
    precioTotal: Float!
    numeroHuespedes: Int!
    comentarios: String
    createdAt: String
    updatedAt: String
  }

  # Enum para estados de reserva
  enum BookingStatus {
    PENDIENTE
    CONFIRMADA
    CANCELADA
    COMPLETADA
  }

  # Input para crear reserva
  input BookingInput {
    habitacionId: ID!
    fechaEntrada: String!
    fechaSalida: String!
    numeroHuespedes: Int!
    comentarios: String
  }

  # Extender Query y Mutation
  extend type Query {
    # Obtener reservas del usuario actual
    getUserBookings: [Booking]! @auth
    
    # Obtener una reserva específica por ID
    getBookingById(id: ID!): Booking @auth
    
    # Obtener reservas de un hotel (para gestores)
    getHotelBookings(hotelId: ID!): [Booking]! @hasRole(role: [ADMIN, HOTEL_MANAGER])
  }

  extend type Mutation {
    # Crear una nueva reserva (requiere autenticación)
    createBooking(input: BookingInput!): Booking! @auth
    
    # Actualizar estado de reserva (para gestores)
    updateBookingStatus(id: ID!, estado: BookingStatus!): Booking! @hasRole(role: [ADMIN, HOTEL_MANAGER])
    
    # Cancelar reserva (el usuario solo puede cancelar sus propias reservas)
    cancelBooking(id: ID!): Booking! @auth
  }
`;

export default bookingTypes;