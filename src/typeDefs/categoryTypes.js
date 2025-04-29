import { gql } from 'apollo-server-express';

const categoryTypes = gql`
  # Tipo para categoría de hotel
  type Category {
    id: ID!
    nombre: String!
    estrellas: Int!
    descripcion: String
    createdAt: String
    updatedAt: String
  }

  # Extender Query
  extend type Query {
    # Obtener todas las categorías de hotel
    getCategorias: [Category]!
    
    # Obtener una categoría específica por ID
    getCategoriaById(id: ID!): Category
    
    # Obtener o crear una categoría por número de estrellas
    getCategoriaByEstrellas(estrellas: Int!): Category
  }
`;

export default categoryTypes;