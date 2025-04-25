import { gql } from 'apollo-server-express';
import authTypes from './authTypes.js';
import peopleTypes from './peopleTypes.js';
import hotelTypes from './hotelTypes.js';
import roomTypes from './roomTypes.js';
import bookingTypes from './bookingTypes.js';

// Definición de tipos base
const baseTypeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

// Combinar todos los tipos
const typeDefs = [
  baseTypeDefs,
  authTypes,
  peopleTypes,
  hotelTypes,
  roomTypes,
  bookingTypes
];

export default typeDefs;