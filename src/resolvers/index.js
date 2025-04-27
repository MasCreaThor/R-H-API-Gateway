// src/resolvers/index.js
import authResolvers from './authResolvers.js';
import peopleResolvers from './peopleResolvers.js';

// Combinamos todos los resolvers en un solo objeto
const resolvers = {
  Query: {
    _: () => true, // Query placeholder
    ...authResolvers.Query,
    ...peopleResolvers.Query,
    
    // Placeholders para resolvers que se implementarán en futuros sprints
    getHoteles: () => [],
    getHotelById: () => null,
    getHotelesDestacados: () => [],
    
    getRoomsByHotelId: () => [],
    getRoomById: () => null,
    checkRoomAvailability: () => false,
    
    getUserBookings: () => [],
    getBookingById: () => null,
    getHotelBookings: () => []
  },
  
  Mutation: {
    _: () => true, // Mutation placeholder
    ...authResolvers.Mutation,
    ...peopleResolvers.Mutation,
    
    // Placeholders para resolvers que se implementarán en futuros sprints
    createRoom: () => null,
    updateRoom: () => null,
    deleteRoom: () => false,
    updateRoomAvailability: () => null,
    
    createBooking: () => null,
    updateBookingStatus: () => null,
    cancelBooking: () => null
  },
  
  // Tipos personalizados
  People: peopleResolvers.People
};

export default resolvers;