import { gql } from 'apollo-server-express';

const hotelTypes = gql`
  # Tipo para hoteles
  type Hotel {
    id: ID!
    nombre: String!
    direccion: String!
    ciudad: String!
    pais: String!
    categoria: Int!
    destacado: Boolean!
    calificacion: Float
    descripcion: String
    imagenes: [String]
    habitaciones: [Room]
    createdAt: String
    updatedAt: String
  }

  # Input para filtros de búsqueda de hoteles
  input HotelFilterInput {
    ciudad: String
    fechaEntrada: String
    fechaSalida: String
    huespedes: Int
    categoria: Int
    precioMin: Float
    precioMax: Float
  }

  # Extender Query
  extend type Query {
    getHoteles(filter: HotelFilterInput): [Hotel]!
    getHotelById(id: ID!): Hotel
    getHotelesDestacados: [Hotel]!
  }
`;

export default hotelTypes;