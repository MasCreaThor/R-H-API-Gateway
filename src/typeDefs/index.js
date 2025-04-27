// src/typeDefs/index.js
import { gql } from 'apollo-server-express';
import authTypes from './authTypes.js';
import peopleTypes from './peopleTypes.js';
import hotelTypes from './hotelTypes.js';
import roomTypes from './roomTypes.js';
import bookingTypes from './bookingTypes.js';

// Definición de tipos base y directivas
const baseTypeDefs = gql`
  # Directivas para autenticación y autorización
  directive @auth on FIELD_DEFINITION
  directive @hasRole(role: [UserRole!]!) on FIELD_DEFINITION
  
  # Tipos base
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

// Combinamos todos los tipos en un array
const typeDefs = [
  baseTypeDefs,
  authTypes,
  peopleTypes,
  hotelTypes,
  roomTypes,
  bookingTypes
];

export default typeDefs;