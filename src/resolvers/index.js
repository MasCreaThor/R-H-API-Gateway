// src/resolvers/index.js
import authResolvers from './authResolvers.js';
import peopleResolvers from './peopleResolvers.js';

// Combinar todos los resolvers
const resolvers = {
  Query: {
    _: () => true,
    ...authResolvers.Query,
    ...peopleResolvers.Query,
    
    // Resolvers para hoteles (a implementar)
    getHoteles: () => [],
    getHotelById: () => null,
    getHotelesDestacados: () => [],
    
    // Resolvers para habitaciones (a implementar)
    getRoomsByHotelId: () => [],
    getRoomById: () => null,
    checkRoomAvailability: () => false,
    
    // Resolvers para reservas (a implementar)
    getUserBookings: () => [],
    getBookingById: () => null,
    getHotelBookings: () => []
  },
  Mutation: {
    _: () => true,
    ...authResolvers.Mutation,
    ...peopleResolvers.Mutation,
    
    // Resolvers para habitaciones (a implementar)
    createRoom: () => null,
    updateRoom: () => null,
    deleteRoom: () => false,
    updateRoomAvailability: () => null,
    
    // Resolvers para reservas (a implementar)
    createBooking: () => null,
    updateBookingStatus: () => null,
    cancelBooking: () => null
  },
  
  // Resolver para tipos personalizados
  People: peopleResolvers.People
};

export default resolvers;