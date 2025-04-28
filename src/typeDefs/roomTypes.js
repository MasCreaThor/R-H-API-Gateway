import { gql } from 'apollo-server-express';

const roomTypes = gql`
  # Tipo para habitaciones
  type Room {
    id: ID!
    hotelId: ID!
    hotel: Hotel
    tipo: String!
    capacidad: Int!
    precio: Float!
    disponibilidad: Boolean!
    disponible: Boolean
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

  # Input para filtrar habitaciones
  input RoomFilterInput {
    fechaEntrada: String
    fechaSalida: String
    capacidad: Int
    precioMin: Float
    precioMax: Float
    disponible: Boolean
  }

  # Extender Query y Mutation
  extend type Query {
    # Obtener habitaciones por hotel
    getRoomsByHotelId(hotelId: ID!, filter: RoomFilterInput): [Room]!
    
    # Obtener habitación por ID
    getRoomById(id: ID!): Room
    
    # Verificar disponibilidad en fechas específicas
    checkRoomAvailability(id: ID!, fechaEntrada: String!, fechaSalida: String!): Boolean!
  }

  extend type Mutation {
    # Operaciones para administradores/gestores de hoteles
    createRoom(input: RoomInput!): Room! @hasRole(role: [ADMIN, HOTEL_MANAGER])
    updateRoom(id: ID!, input: RoomInput!): Room! @hasRole(role: [ADMIN, HOTEL_MANAGER])
    deleteRoom(id: ID!): Boolean! @hasRole(role: [ADMIN, HOTEL_MANAGER])
    updateRoomAvailability(id: ID!, disponibilidad: Boolean!): Room! @hasRole(role: [ADMIN, HOTEL_MANAGER])
  }
`;

export default roomTypes;