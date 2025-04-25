import { gql } from 'apollo-server-express';

const peopleTypes = gql`
  # Tipo para información personal del usuario
  type People {
    id: ID!
    userId: ID!
    nombre: String!
    apellido: String!
    telefono: String
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
    getPeopleInfo: People
  }

  extend type Mutation {
    updatePeopleInfo(input: PeopleInput!): People!
  }
`;

export default peopleTypes;