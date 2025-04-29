// src/resolvers/bookingResolvers.js
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server-express';

const bookingResolvers = {
  Query: {
    /**
     * Obtener las reservas del usuario autenticado
     */
    getUserBookings: async (_, __, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para ver sus reservas');
      }

      try {
        const response = await fetch(`${services.reservas}/api/bookings/user`);

        if (!response.ok) {
          throw new Error('Error al obtener reservas del usuario');
        }

        return await response.json();
      } catch (error) {
        console.error('Error en resolver getUserBookings:', error);
        throw new Error('Error al obtener las reservas');
      }
    },

    /**
     * Obtener una reserva específica por ID
     */
    getBookingById: async (_, { id }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para ver una reserva');
      }

      try {
        const response = await fetch(`${services.reservas}/api/bookings/${id}`);

        if (response.status === 404) {
          return null;
        }

        if (response.status === 403) {
          throw new ForbiddenError('No tiene permiso para ver esta reserva');
        }

        if (!response.ok) {
          throw new Error('Error al obtener la reserva');
        }

        return await response.json();
      } catch (error) {
        console.error('Error en resolver getBookingById:', error);
        throw new Error('Error al obtener la reserva');
      }
    },

    /**
     * Obtener reservas de un hotel (solo para ADMIN o HOTEL_MANAGER)
     */
    getHotelBookings: async (_, { hotelId }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para acceder a esta información');
      }

      if (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para acceder a esta información');
      }

      try {
        // Este endpoint deberá implementarse en el microservicio de reservas
        const response = await fetch(`${services.reservas}/api/hotels/${hotelId}/bookings`);

        if (!response.ok) {
          throw new Error('Error al obtener reservas del hotel');
        }

        return await response.json();
      } catch (error) {
        console.error('Error en resolver getHotelBookings:', error);
        throw new Error('Error al obtener las reservas del hotel');
      }
    },

    /**
     * Dashboard de administrador: estadísticas de reservas
     */
    getBookingStats: async (_, __, { user, services, fetch }) => {
      if (!user || (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER')) {
        throw new ForbiddenError('No tiene permisos para acceder a esta información');
      }

      try {
        // Este endpoint deberá implementarse en el microservicio de reservas
        const response = await fetch(`${services.reservas}/api/bookings/stats`);

        if (!response.ok) {
          throw new Error('Error al obtener estadísticas de reservas');
        }

        return await response.json();
      } catch (error) {
        console.error('Error en resolver getBookingStats:', error);
        throw new Error('Error al obtener estadísticas de reservas');
      }
    }
  },

  Mutation: {
    /**
     * Crear una nueva reserva
     */
    createBooking: async (_, { input }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para crear una reserva');
      }

      try {
        const response = await fetch(`${services.reservas}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al crear la reserva');
        }

        return await response.json();
      } catch (error) {
        console.error('Error en resolver createBooking:', error);
        throw new UserInputError(error.message || 'Error al crear la reserva');
      }
    },

    /**
     * Cancelar una reserva
     */
    cancelBooking: async (_, { id }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para cancelar una reserva');
      }

      try {
        const response = await fetch(`${services.reservas}/api/bookings/${id}/cancel`, {
          method: 'PUT',
        });

        if (response.status === 404) {
          throw new UserInputError('Reserva no encontrada');
        }

        if (response.status === 403) {
          throw new ForbiddenError('No tiene permiso para cancelar esta reserva');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al cancelar la reserva');
        }

        return await response.json();
      } catch (error) {
        console.error('Error en resolver cancelBooking:', error);
        throw new UserInputError(error.message || 'Error al cancelar la reserva');
      }
    },

    /**
     * Actualizar estado de una reserva (solo ADMIN o HOTEL_MANAGER)
     */
    updateBookingStatus: async (_, { id, estado }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para actualizar una reserva');
      }

      if (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para actualizar el estado de reservas');
      }

      try {
        // Este endpoint deberá implementarse en el microservicio de reservas
        const response = await fetch(`${services.reservas}/api/bookings/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado }),
        });

        if (response.status === 404) {
          throw new UserInputError('Reserva no encontrada');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al actualizar el estado de la reserva');
        }

        return await response.json();
      } catch (error) {
        console.error('Error en resolver updateBookingStatus:', error);
        throw new UserInputError(error.message || 'Error al actualizar el estado de la reserva');
      }
    }
  },

  // Resolvers de campos para tipos relacionados
  Booking: {
    habitacion: async (parent, _, { services, fetch }) => {
      if (!parent.habitacionId) return null;

      try {
        const response = await fetch(`${services.reservas}/api/rooms/${parent.habitacionId}`);
        if (!response.ok) return null;
        return await response.json();
      } catch (error) {
        console.error('Error al obtener habitación de reserva:', error);
        return null;
      }
    },
    // Este campo puede ser útil para determinar si una reserva puede ser cancelada
    cancelable: (parent) => {
      return parent.estado !== 'CANCELADA' && parent.estado !== 'COMPLETADA';
    }
  }
};

export default bookingResolvers;