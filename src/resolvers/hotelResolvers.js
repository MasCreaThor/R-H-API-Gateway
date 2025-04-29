// src/resolvers/hotelResolvers.js
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server-express';

const hotelResolvers = {
  Query: {
    /**
     * Obtener lista de hoteles con filtros opcionales
     */
    getHoteles: async (_, { filter }, { services, fetch }) => {
      try {
        // Construir URL con parámetros de filtro
        let url = `${services.reservas}/api/hotels`;
        
        if (filter) {
          const params = new URLSearchParams();
          
          if (filter.ciudad) params.append('ciudad', filter.ciudad);
          // Permitir filtrado por estrellas o categoría (ID)
          if (filter.categoria) params.append('categoria', filter.categoria);
          if (filter.estrellas) params.append('estrellas', filter.estrellas);
          if (filter.destacado !== undefined) params.append('destacado', filter.destacado);
          if (filter.precioMin) params.append('precioMin', filter.precioMin);
          if (filter.precioMax) params.append('precioMax', filter.precioMax);
          
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Error al obtener hoteles');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getHoteles:', error);
        throw new Error('Error al obtener la lista de hoteles');
      }
    },
    
    /**
     * Obtener un hotel específico por ID
     */
    getHotelById: async (_, { id }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.reservas}/api/hotels/${id}`);
        
        if (response.status === 404) {
          return null;
        }
        
        if (!response.ok) {
          throw new Error('Error al obtener el hotel');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getHotelById:', error);
        throw new Error('Error al obtener información del hotel');
      }
    },
    
    /**
     * Obtener hoteles destacados para mostrar en la página principal
     */
    getHotelesDestacados: async (_, __, { services, fetch }) => {
      try {
        const response = await fetch(`${services.reservas}/api/hotels/destacados`);
        
        if (!response.ok) {
          throw new Error('Error al obtener hoteles destacados');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getHotelesDestacados:', error);
        throw new Error('Error al obtener hoteles destacados');
      }
    },
    
    /**
     * Dashboard ADMIN: Obtener estadísticas de hoteles
     */
    getHotelStats: async (_, __, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para acceder a esta información');
      }
      
      if (user.role.name !== 'ADMIN') {
        throw new ForbiddenError('No tiene permisos para acceder a esta información');
      }
      
      try {
        // Este endpoint deberá implementarse en el microservicio de reservas
        const response = await fetch(`${services.reservas}/api/hotels/stats`);
        
        if (!response.ok) {
          throw new Error('Error al obtener estadísticas de hoteles');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getHotelStats:', error);
        throw new Error('Error al obtener estadísticas de hoteles');
      }
    },
    
    /**
     * Dashboard HOTEL_MANAGER: Obtener hoteles gestionados por el manager
     */
    getManagerHotels: async (_, __, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para acceder a esta información');
      }
      
      if (user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para acceder a esta información');
      }
      
      try {
        // Este endpoint deberá implementarse en el microservicio de reservas
        const response = await fetch(`${services.reservas}/api/hotels/manager`);
        
        if (!response.ok) {
          throw new Error('Error al obtener hoteles gestionados');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getManagerHotels:', error);
        throw new Error('Error al obtener hoteles gestionados');
      }
    }
  },
  
  Mutation: {
    /**
     * ADMIN: Actualizar estado de destacado de un hotel
     */
    updateHotelDestacado: async (_, { id, destacado }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para actualizar un hotel');
      }
      
      if (user.role.name !== 'ADMIN') {
        throw new ForbiddenError('No tiene permisos para actualizar el estado destacado de hoteles');
      }
      
      try {
        // Este endpoint deberá implementarse en el microservicio de reservas
        const response = await fetch(`${services.reservas}/api/hotels/${id}/destacado`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ destacado }),
        });
        
        if (response.status === 404) {
          throw new UserInputError('Hotel no encontrado');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al actualizar el hotel');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver updateHotelDestacado:', error);
        throw new UserInputError(error.message || 'Error al actualizar el hotel');
      }
    },
    
    /**
     * ADMIN: Crear un nuevo hotel
     */
    createHotel: async (_, { input }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para crear un hotel');
      }
      
      if (user.role.name !== 'ADMIN') {
        throw new ForbiddenError('No tiene permisos para crear hoteles');
      }
      
      try {
        // Este endpoint deberá implementarse en el microservicio de reservas
        const response = await fetch(`${services.reservas}/api/hotels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al crear el hotel');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver createHotel:', error);
        throw new UserInputError(error.message || 'Error al crear el hotel');
      }
    },
    
    /**
     * ADMIN/HOTEL_MANAGER: Actualizar información de un hotel
     */
    updateHotel: async (_, { id, input }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para actualizar un hotel');
      }
      
      if (user.role.name !== 'ADMIN' && user.role.name !== 'HOTEL_MANAGER') {
        throw new ForbiddenError('No tiene permisos para actualizar hoteles');
      }
      
      try {
        // HOTEL_MANAGER solo puede actualizar hoteles que gestiona
        let url = `${services.reservas}/api/hotels/${id}`;
        
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });
        
        if (response.status === 403) {
          throw new ForbiddenError('No tiene permisos para actualizar este hotel');
        }
        
        if (response.status === 404) {
          throw new UserInputError('Hotel no encontrado');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al actualizar el hotel');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver updateHotel:', error);
        throw new UserInputError(error.message || 'Error al actualizar el hotel');
      }
    }
  },
  
  // Resolvers de campos para tipos relacionados
  Hotel: {
    habitaciones: async (parent, _, { services, fetch }) => {
      if (!parent.id) return [];
      
      try {
        const response = await fetch(`${services.reservas}/api/rooms/hotel/${parent.id}`);
        if (!response.ok) return [];
        return await response.json();
      } catch (error) {
        console.error('Error al obtener habitaciones del hotel:', error);
        return [];
      }
    },
    
    // Resolver específico para garantizar la estructura correcta de categoría
    categoria: async (parent, _, { services, fetch }) => {
      // Si ya tenemos la información completa de categoría, usarla
      if (parent.categoria && parent.categoria.id) {
        return parent.categoria;
      }
      
      // Si solo tenemos el ID de categoría, obtener la información completa
      if (parent.categoryId) {
        try {
          const response = await fetch(`${services.reservas}/api/categories/${parent.categoryId}`);
          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          console.error('Error al obtener categoría del hotel:', error);
        }
      }
      
      // Devolver un objeto vacío si no podemos obtener la categoría
      return null;
    }
  }
};

export default hotelResolvers;