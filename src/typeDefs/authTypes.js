import { gql } from 'apollo-server-express';

const authTypes = gql`
  # Tipo para roles de usuario
  type Role {
    id: ID!
    name: String!
  }

  # Tipo para información básica del usuario
  type User {
    id: ID!
    email: String!
    role: Role!
    createdAt: String
    updatedAt: String
  }

  # Tipo para tokens de autenticación
  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
  }

  # Input para registro de usuario
  input RegisterInput {
    email: String!
    password: String!
    roleId: ID
  }

  # Input para login
  input LoginInput {
    email: String!
    password: String!
  }

  # Extender Query y Mutation
  extend type Query {
    me: User
    validateToken: Boolean!
  }

  extend type Mutation {
    register(input: RegisterInput!, peopleInput: PeopleInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(token: String!): AuthPayload!
  }
`;

export default authTypes;