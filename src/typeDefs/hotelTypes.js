import { gql } from 'apollo-server-express';

const hotelTypes = gql`
  # Tipo para hoteles
  type Hotel {
    id: ID!
    nombre: String!
    direccion: String!
    ciudad: String!
    pais: String!
    categoria: Category
    destacado: Boolean!
    calificacion: Float
    calificacionPromedio: Float
    descripcion: String
    imagenes: [String]
    habitaciones: [Room]
    createdAt: String
    updatedAt: String
  }

  # Tipo para categoría de hotel
  type Category {
    id: ID!
    nombre: String!
    estrellas: Int!
    descripcion: String
  }

  # Input para filtros de búsqueda de hoteles
  input HotelFilterInput {
    ciudad: String
    fechaEntrada: String
    fechaSalida: String
    huespedes: Int
    categoria: Int
    estrellas: Int
    precioMin: Float
    precioMax: Float
    destacado: Boolean
  }

  # Input para crear/actualizar hotel
  input HotelInput {
    nombre: String!
    direccion: String!
    ciudad: String!
    pais: String!
    categoria: Int!
    descripcion: String
    imagenes: [String]
  }

  # Estadísticas de hoteles para dashboard
  type HotelStats {
    totalHoteles: Int!
    hotelesActivos: Int!
    hotelesDestacados: Int!
    categoriasMasComunes: [CategoryStat]
    ciudadesMasComunes: [CityStat]
  }

  # Estadística por categoría
  type CategoryStat {
    categoria: Int!
    cantidad: Int!
  }

  # Estadística por ciudad
  type CityStat {
    ciudad: String!
    cantidad: Int!
  }

  # Extender Query y Mutation
  extend type Query {
    # Obtener lista de hoteles con filtros opcionales
    getHoteles(filter: HotelFilterInput): [Hotel]!
    
    # Obtener un hotel específico por ID
    getHotelById(id: ID!): Hotel
    
    # Obtener hoteles destacados para mostrar en la página principal
    getHotelesDestacados: [Hotel]!
    
    # Obtener todas las categorías de hotel
    getCategorias: [Category]!
    
    # Dashboard ADMIN: Obtener estadísticas de hoteles
    getHotelStats: HotelStats @hasRole(role: [ADMIN])
    
    # Dashboard HOTEL_MANAGER: Obtener hoteles gestionados por el manager
    getManagerHotels: [Hotel!]! @hasRole(role: [HOTEL_MANAGER])
  }

  extend type Mutation {
    # ADMIN: Actualizar estado de destacado de un hotel
    updateHotelDestacado(id: ID!, destacado: Boolean!): Hotel! @hasRole(role: [ADMIN])
    
    # ADMIN: Crear un nuevo hotel
    createHotel(input: HotelInput!): Hotel! @hasRole(role: [ADMIN])
    
    # ADMIN/HOTEL_MANAGER: Actualizar información de un hotel
    updateHotel(id: ID!, input: HotelInput!): Hotel! @hasRole(role: [ADMIN, HOTEL_MANAGER])
  }
`;

export default hotelTypes;