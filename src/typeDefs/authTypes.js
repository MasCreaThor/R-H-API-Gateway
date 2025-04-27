import { gql } from 'apollo-server-express';

const authTypes = gql`
  # Enumeración para roles de usuario
  enum UserRole {
    ADMIN
    USER
    HOTEL_MANAGER
  }

  # Tipo para roles de usuario
  type Role {
    id: ID!
    name: UserRole!
  }

  # Tipo para información básica del usuario
  type User {
    id: ID!
    email: String!
    role: Role!
    people: People
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
    passwordConfirm: String!
    roleId: ID
  }

  # Input para login
  input LoginInput {
    email: String!
    password: String!
  }

  # Input para refresh token
  input RefreshTokenInput {
    refreshToken: String!
  }

  # Input para cambiar contraseña
  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
    newPasswordConfirm: String!
  }

  # Extender Query y Mutation
  extend type Query {
    # Obtener información del usuario autenticado
    me: User @auth
    
    # Validar token JWT
    validateToken(token: String!): Boolean!
  }

  extend type Mutation {
    # Registrar un nuevo usuario con información personal
    register(input: RegisterInput!, peopleInput: PeopleInput!): AuthPayload!
    
    # Iniciar sesión
    login(input: LoginInput!): AuthPayload!
    
    # Refrescar token caducado
    refreshToken(input: RefreshTokenInput!): AuthPayload!
    
    # Cerrar sesión (invalidar refresh token)
    logout: Boolean!
    
    # Cambiar contraseña
    changePassword(input: ChangePasswordInput!): Boolean! @auth
  }
`;

export default authTypes;