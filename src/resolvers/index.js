// Resolvers para GraphQL
const resolvers = {
    Query: {
      _: () => true,
      // Resolvers para auth
      me: () => null,
      validateToken: () => false,
      
      // Resolvers para people
      getPeopleInfo: () => null,
      
      // Resolvers para hoteles
      getHoteles: () => [],
      getHotelById: () => null,
      getHotelesDestacados: () => [],
      
      // Resolvers para habitaciones
      getRoomsByHotelId: () => [],
      getRoomById: () => null,
      checkRoomAvailability: () => false,
      
      // Resolvers para reservas
      getUserBookings: () => [],
      getBookingById: () => null,
      getHotelBookings: () => []
    },
    Mutation: {
      _: () => true,
      // Resolvers para auth
      register: () => null,
      login: () => null,
      refreshToken: () => null,
      
      // Resolvers para people
      updatePeopleInfo: () => null,
      
      // Resolvers para habitaciones
      createRoom: () => null,
      updateRoom: () => null,
      deleteRoom: () => false,
      updateRoomAvailability: () => null,
      
      // Resolvers para reservas
      createBooking: () => null,
      updateBookingStatus: () => null,
      cancelBooking: () => null
    }
  };
  
  export default resolvers;