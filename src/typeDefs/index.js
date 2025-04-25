import { gql } from 'apollo-server-express';

// Definición de tipos GraphQL
const typeDefs = gql`
  # Tipo Query principal
  type Query {
    _: Boolean
  }

  # Tipo Mutation principal
  type Mutation {
    _: Boolean
  }
`;

export default typeDefs;