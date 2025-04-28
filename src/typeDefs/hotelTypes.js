// src/typeDefs/hotelTypes.js

import { gql } from 'apollo-server-express';

const hotelTypes = gql`
  # Tipo para información de país
  type Country {
    id: ID!
    nombre: String!
    codigo: String!
  }

  # Tipo para información de ciudad
  type City {
    id: ID!
    nombre: String!
    country: Country
  }

  # Tipo para información de dirección
  type Address {
    id: ID!
    calle: String!
    numero: String
    codigoPostal: String
    city: City
  }

  # Tipo para categoría de hotel
  type Category {
    id: ID!
    nombre: String!
    estrellas: Int!
    descripcion: String
  }

  # Tipo para calificación de hotel
  type Rating {
    id: ID!
    hotelId: ID!
    userId: ID!
    puntuacion: Float!
    comentario: String
    createdAt: String
    updatedAt: String
  }

  # Tipo para hoteles
  type Hotel {
    id: ID!
    nombre: String!
    direccion: Address
    categoria: Category
    destacado: Boolean!
    calificacionPromedio: Float
    descripcion: String
    imagenes: [String]
    habitaciones: [Room]
    calificaciones: [Rating]
    createdAt: String
    updatedAt: String
  }

  # Input para filtros de búsqueda de hoteles
  input HotelFilterInput {
    ciudad: String
    pais: String
    fechaEntrada: String
    fechaSalida: String
    huespedes: Int
    categoria: Int
    precioMin: Float
    precioMax: Float
    destacado: Boolean
  }

  # Extender Query
  extend type Query {
    # Obtener lista de hoteles con filtros opcionales
    getHoteles(filter: HotelFilterInput): [Hotel]!
    
    # Obtener un hotel específico por ID
    getHotelById(id: ID!): Hotel
    
    # Obtener hoteles destacados para mostrar en la página principal
    getHotelesDestacados(limit: Int): [Hotel]!
  }
`;

export default hotelTypes;