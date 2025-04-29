// src/resolvers/index.js
import authResolvers from './authResolvers.js';
import peopleResolvers from './peopleResolvers.js';
import hotelResolvers from './hotelResolvers.js';
import roomResolvers from './roomResolvers.js';
import bookingResolvers from './bookingResolvers.js';
import categoryResolvers from './categoryResolvers.js';

// Combinamos todos los resolvers en un solo objeto
const resolvers = {
  Query: {
    _: () => true, // Query placeholder (no debe existir Query placeholder en GraphQL)
    ...authResolvers.Query,
    ...peopleResolvers.Query,
    ...hotelResolvers.Query,
    ...roomResolvers.Query,
    ...bookingResolvers.Query,
    ...categoryResolvers.Query
  },
  
  Mutation: {
    _: () => true, // Mutation placeholder
    ...authResolvers.Mutation,
    ...peopleResolvers.Mutation,
    ...hotelResolvers.Mutation,
    ...roomResolvers.Mutation,
    ...bookingResolvers.Mutation
  },
  
  // Tipos personalizados
  People: peopleResolvers.People,
  Booking: bookingResolvers.Booking,
  Room: roomResolvers.Room,
  Hotel: hotelResolvers.Hotel
};

export default resolvers;