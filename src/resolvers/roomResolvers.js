// src/resolvers/roomResolvers.js
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server-express';

const roomResolvers = {
  Query: {
    /**
     * Obtener habitaciones por hotel
     */
    getRoomsByHotelId: async (_, { hotelId, filter }, { services, fetch }) => {
      try {
        // Construir URL con parámetros de filtro
        let url = `${services.reservas}/api/rooms/hotel/${hotelId}`;
        
        if (filter) {
          const params = new URLSearchParams();
          
          if (filter.capacidad) params.append('capacidad', filter.capacidad);
          if (filter.fechaEntrada) params.append('fechaEntrada', filter.fechaEntrada);
          if (filter.fechaSalida) params.append('fechaSalida', filter.fechaSalida);
          
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
        }
        
        const response = await fetch(url);
        
        if (response.status === 404) {
          return [];
        }
        
        if (!response.ok) {
          throw new Error('Error al obtener habitaciones');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getRoomsByHotelId:', error);
        throw new Error('Error al obtener habitaciones del hotel');
      }
    },
    
    /**
     * Obtener una habitación específica por ID
     */
    getRoomById: async (_, { id }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.reservas}/api/rooms/${id}`);
        
        if (response.status === 404) {
          return null;
        }
        
        if (!response.ok) {
          throw new Error('Error al obtener la habitación');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getRoomById:', error);
        throw new Error('Error al obtener información de la habitación');
      }
    },
    
    /**
     * Verificar disponibilidad de una habitación en fechas específicas
     */
    checkRoomAvailability: async (_, { id, fechaEntrada, fechaSalida }, { services, fetch }) => {
      try {
        const url = `${services.reservas}/api/rooms/${id}/availability?fechaEntrada=${fechaEntrada}&fechaSalida=${fechaSalida}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Error al verificar disponibilidad');
        }
        
        const data = await response.json();
        return data.disponible || false;
      } catch (error) {
        console.error('Error en resolver checkRoomAvailability:', error);
        return false;
      }
    },
    
    /**
     * Dashboard ADMIN/HOTEL_MANAGER: Obtener todas las habitaciones con opciones de filtrado
     */
    getDashboardRooms: async (_, { filter }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para acceder a esta información');
      }
      
      if (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para acceder a esta información');
      }
      
      try {
        // Construir URL con parámetros de filtro
        let url = `${services.reservas}/api/rooms/dashboard`;
        
        if (filter) {
          const params = new URLSearchParams();
          
          if (filter.hotelId) params.append('hotelId', filter.hotelId);
          if (filter.disponibilidad !== undefined) params.append('disponibilidad', filter.disponibilidad);
          if (filter.tipo) params.append('tipo', filter.tipo);
          
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Error al obtener habitaciones para el dashboard');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getDashboardRooms:', error);
        throw new Error('Error al obtener habitaciones para el dashboard');
      }
    }
  },
  
  Mutation: {
    /**
     * Crear una nueva habitación (ADMIN, HOTEL_MANAGER)
     */
    createRoom: async (_, { input }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para crear una habitación');
      }
      
      if (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para crear habitaciones');
      }
      
      try {
        const response = await fetch(`${services.reservas}/api/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al crear la habitación');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver createRoom:', error);
        throw new UserInputError(error.message || 'Error al crear la habitación');
      }
    },
    
    /**
     * Actualizar una habitación existente (ADMIN, HOTEL_MANAGER)
     */
    updateRoom: async (_, { id, input }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para actualizar una habitación');
      }
      
      if (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para actualizar habitaciones');
      }
      
      try {
        const response = await fetch(`${services.reservas}/api/rooms/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });
        
        if (response.status === 404) {
          throw new UserInputError('Habitación no encontrada');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al actualizar la habitación');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver updateRoom:', error);
        throw new UserInputError(error.message || 'Error al actualizar la habitación');
      }
    },
    
    /**
     * Eliminar una habitación (ADMIN, HOTEL_MANAGER)
     */
    deleteRoom: async (_, { id }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para eliminar una habitación');
      }
      
      if (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para eliminar habitaciones');
      }
      
      try {
        const response = await fetch(`${services.reservas}/api/rooms/${id}`, {
          method: 'DELETE',
        });
        
        if (response.status === 404) {
          throw new UserInputError('Habitación no encontrada');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al eliminar la habitación');
        }
        
        return true;
      } catch (error) {
        console.error('Error en resolver deleteRoom:', error);
        return false;
      }
    },
    
    /**
     * Actualizar disponibilidad de una habitación (ADMIN, HOTEL_MANAGER)
     */
    updateRoomAvailability: async (_, { id, disponibilidad }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para actualizar la disponibilidad');
      }
      
      if (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para actualizar la disponibilidad');
      }
      
      try {
        const response = await fetch(`${services.reservas}/api/rooms/${id}/availability`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ disponibilidad }),
        });
        
        if (response.status === 404) {
          throw new UserInputError('Habitación no encontrada');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al actualizar la disponibilidad');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver updateRoomAvailability:', error);
        throw new UserInputError(error.message || 'Error al actualizar la disponibilidad');
      }
    }
  },
  
  // Resolvers de campos para tipos relacionados
  Room: {
    hotel: async (parent, _, { services, fetch }) => {
      if (!parent.hotelId) return null;
      
      try {
        const response = await fetch(`${services.reservas}/api/hotels/${parent.hotelId}`);
        if (!response.ok) return null;
        return await response.json();
      } catch (error) {
        console.error('Error al obtener hotel de habitación:', error);
        return null;
      }
    }
  }
};

export default roomResolvers;