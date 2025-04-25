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
    getUserBookings: [Booking]!
    getBookingById(id: ID!): Booking
    getHotelBookings(hotelId: ID!): [Booking]!
  }

  extend type Mutation {
    createBooking(input: BookingInput!): Booking!
    updateBookingStatus(id: ID!, estado: BookingStatus!): Booking!
    cancelBooking(id: ID!): Booking!
  }
`;

export default bookingTypes;