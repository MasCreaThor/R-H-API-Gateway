import { gql } from 'apollo-server-express';

const roomTypes = gql`
  # Tipo para habitaciones
  type Room {
    id: ID!
    hotelId: ID!
    tipo: String!
    capacidad: Int!
    precio: Float!
    disponibilidad: Boolean!
    imagenes: [String]
    descripcion: String
    amenities: [String]
    createdAt: String
    updatedAt: String
  }

  # Input para crear/actualizar habitaciones
  input RoomInput {
    hotelId: ID!
    tipo: String!
    capacidad: Int!
    precio: Float!
    disponibilidad: Boolean!
    imagenes: [String]
    descripcion: String
    amenities: [String]
  }

  # Extender Query y Mutation
  extend type Query {
    getRoomsByHotelId(hotelId: ID!): [Room]!
    getRoomById(id: ID!): Room
    checkRoomAvailability(id: ID!, fechaEntrada: String!, fechaSalida: String!): Boolean!
  }

  extend type Mutation {
    createRoom(input: RoomInput!): Room!
    updateRoom(id: ID!, input: RoomInput!): Room!
    deleteRoom(id: ID!): Boolean!
    updateRoomAvailability(id: ID!, disponibilidad: Boolean!): Room!
  }
`;

export default roomTypes;