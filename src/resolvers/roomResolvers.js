// src/resolvers/roomResolvers.js
import { UserInputError } from 'apollo-server-express';

const roomResolvers = {
  Query: {
    /**
     * Obtener habitaciones por hotel
     */
    getRoomsByHotelId: async (_, { hotelId, filter = {} }, { services, fetch }) => {
      try {
        // Construir parámetros de consulta a partir del filtro
        const queryParams = new URLSearchParams();
        
        if (filter.capacidad) queryParams.append('capacidad', filter.capacidad);
        if (filter.fechaEntrada) queryParams.append('fechaEntrada', filter.fechaEntrada);
        if (filter.fechaSalida) queryParams.append('fechaSalida', filter.fechaSalida);
        
        // Construir URL con parámetros de consulta
        const url = `${services.reservas}/api/rooms/hotel/${hotelId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            return []; // Hotel no encontrado o sin habitaciones
          }
          throw new UserInputError('Error al obtener habitaciones');
        }
        
        const habitaciones = await response.json();
        return habitaciones;
      } catch (error) {
        console.error('Error en resolver getRoomsByHotelId:', error);
        throw new UserInputError('Error al obtener habitaciones');
      }
    },
    
    /**
     * Obtener habitación por ID
     */
    getRoomById: async (_, { id }, { services, fetch }) => {
      try {
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(`${services.reservas}/api/rooms/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            return null; // Habitación no encontrada
          }
          throw new UserInputError('Error al obtener habitación');
        }
        
        const habitacion = await response.json();
        return habitacion;
      } catch (error) {
        console.error('Error en resolver getRoomById:', error);
        throw new UserInputError('Error al obtener habitación');
      }
    },
    
    /**
     * Verificar disponibilidad en fechas específicas
     */
    checkRoomAvailability: async (_, { id, fechaEntrada, fechaSalida }, { services, fetch }) => {
      try {
        // Construir parámetros de consulta
        const queryParams = new URLSearchParams();
        queryParams.append('fechaEntrada', fechaEntrada);
        queryParams.append('fechaSalida', fechaSalida);
        
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(`${services.reservas}/api/rooms/${id}/availability?${queryParams.toString()}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            return false; // Habitación no encontrada
          }
          throw new UserInputError('Error al verificar disponibilidad');
        }
        
        const { disponible } = await response.json();
        return disponible;
      } catch (error) {
        console.error('Error en resolver checkRoomAvailability:', error);
        throw new UserInputError('Error al verificar disponibilidad');
      }
    }
  },
  
  Mutation: {
    /**
     * Crear una nueva habitación
     */
    createRoom: async (_, { input }, { services, fetch, user }) => {
      try {
        // Verificar que el usuario está autenticado y tiene permisos
        if (!user || !['ADMIN', 'HOTEL_MANAGER'].includes(user.role.name)) {
          throw new UserInputError('No tiene permisos para crear habitaciones');
        }
        
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(`${services.reservas}/api/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(input)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al crear habitación');
        }
        
        const habitacion = await response.json();
        return habitacion;
      } catch (error) {
        console.error('Error en resolver createRoom:', error);
        throw new UserInputError(error.message || 'Error al crear habitación');
      }
    },
    
    /**
     * Actualizar una habitación existente
     */
    updateRoom: async (_, { id, input }, { services, fetch, user }) => {
      try {
        // Verificar que el usuario está autenticado y tiene permisos
        if (!user || !['ADMIN', 'HOTEL_MANAGER'].includes(user.role.name)) {
          throw new UserInputError('No tiene permisos para actualizar habitaciones');
        }
        
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(`${services.reservas}/api/rooms/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(input)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al actualizar habitación');
        }
        
        const habitacion = await response.json();
        return habitacion;
      } catch (error) {
        console.error('Error en resolver updateRoom:', error);
        throw new UserInputError(error.message || 'Error al actualizar habitación');
      }
    },
    
    /**
     * Eliminar una habitación
     */
    deleteRoom: async (_, { id }, { services, fetch, user }) => {
      try {
        // Verificar que el usuario está autenticado y tiene permisos
        if (!user || !['ADMIN', 'HOTEL_MANAGER'].includes(user.role.name)) {
          throw new UserInputError('No tiene permisos para eliminar habitaciones');
        }
        
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(`${services.reservas}/api/rooms/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al eliminar habitación');
        }
        
        return true;
      } catch (error) {
        console.error('Error en resolver deleteRoom:', error);
        throw new UserInputError(error.message || 'Error al eliminar habitación');
      }
    },
    
    /**
     * Actualizar disponibilidad de una habitación
     */
    updateRoomAvailability: async (_, { id, disponibilidad }, { services, fetch, user }) => {
      try {
        // Verificar que el usuario está autenticado y tiene permisos
        if (!user || !['ADMIN', 'HOTEL_MANAGER'].includes(user.role.name)) {
          throw new UserInputError('No tiene permisos para actualizar disponibilidad');
        }
        
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(`${services.reservas}/api/rooms/${id}/availability`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ disponibilidad })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al actualizar disponibilidad');
        }
        
        const habitacion = await response.json();
        return habitacion;
      } catch (error) {
        console.error('Error en resolver updateRoomAvailability:', error);
        throw new UserInputError(error.message || 'Error al actualizar disponibilidad');
      }
    }
  },
  
  // Resolvers para campos complejos o relaciones
  Room: {
    // Resolver para obtener el hotel de una habitación
    hotel: async (parent, _, { services, fetch }) => {
      // Si ya tenemos el hotel de la habitación, devolverlo
      if (parent.hotel) {
        return parent.hotel;
      }
      
      // Si solo tenemos el ID del hotel, obtener el hotel completo
      if (parent.hotelId) {
        try {
          const response = await fetch(`${services.reservas}/api/hotels/${parent.hotelId}`);
          
          if (!response.ok) {
            console.error('Error al obtener hotel de la habitación:', response.statusText);
            return null;
          }
          
          const hotel = await response.json();
          return hotel;
        } catch (error) {
          console.error('Error al resolver hotel de la habitación:', error);
          return null;
        }
      }
      
      return null;
    }
  }
};

export default roomResolvers;