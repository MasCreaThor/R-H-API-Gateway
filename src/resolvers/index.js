// src/resolvers/index.js
import authResolvers from './authResolvers.js';
import peopleResolvers from './peopleResolvers.js';
import hotelResolvers from './hotelResolvers.js';
import roomResolvers from './roomResolvers.js';

// Combinamos todos los resolvers en un solo objeto
const resolvers = {
  Query: {
    _: () => true, // Query placeholder
    ...authResolvers.Query,
    ...peopleResolvers.Query,
    ...hotelResolvers.Query,
    ...roomResolvers.Query,
  },
  
  Mutation: {
    _: () => true, // Mutation placeholder
    ...authResolvers.Mutation,
    ...peopleResolvers.Mutation,
    ...roomResolvers.Mutation,
  },
  
  // Tipos personalizados
  People: peopleResolvers.People,
  Hotel: hotelResolvers.Hotel,
  Room: roomResolvers.Room,
};

export default resolvers;