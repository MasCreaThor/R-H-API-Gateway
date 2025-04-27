import { gql } from 'apollo-server-express';

const peopleTypes = gql`
  # Tipo para información personal del usuario
  type People {
    id: ID!
    userId: ID!
    nombre: String!
    apellido: String!
    telefono: String
    nombreCompleto: String
    createdAt: String
    updatedAt: String
  }

  # Input para información personal
  input PeopleInput {
    nombre: String!
    apellido: String!
    telefono: String
  }

  # Extender Query y Mutation
  extend type Query {
    # Obtener información personal del usuario autenticado
    getPeopleInfo: People @auth
    
    # Admin: Obtener información personal por ID de usuario
    getPeopleByUserId(userId: ID!): People @hasRole(role: [ADMIN])
    
    # Admin: Listar toda la información personal
    getAllPeople: [People!]! @hasRole(role: [ADMIN])
  }

  extend type Mutation {
    # Actualizar información personal
    updatePeopleInfo(input: PeopleInput!): People! @auth
  }
`;

export default peopleTypes;