// src/resolvers/hotelResolvers.js
import { UserInputError } from 'apollo-server-express';

const hotelResolvers = {
  Query: {
    /**
     * Obtener lista de hoteles con filtros opcionales
     */
    getHoteles: async (_, { filter = {} }, { services, fetch }) => {
      try {
        // Construir parámetros de consulta a partir del filtro
        const queryParams = new URLSearchParams();
        
        if (filter.ciudad) queryParams.append('ciudad', filter.ciudad);
        if (filter.categoria) queryParams.append('categoria', filter.categoria);
        if (filter.precioMin) queryParams.append('precioMin', filter.precioMin);
        if (filter.precioMax) queryParams.append('precioMax', filter.precioMax);
        if (filter.destacado !== undefined) queryParams.append('destacado', filter.destacado);
        
        // Construir URL con parámetros de consulta
        const url = `${services.reservas}/api/hotels${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new UserInputError('Error al obtener hoteles');
        }
        
        const hoteles = await response.json();
        return hoteles;
      } catch (error) {
        console.error('Error en resolver getHoteles:', error);
        throw new UserInputError('Error al obtener hoteles');
      }
    },
    
    /**
     * Obtener un hotel específico por ID
     */
    getHotelById: async (_, { id }, { services, fetch }) => {
      try {
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(`${services.reservas}/api/hotels/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            return null; // Hotel no encontrado
          }
          throw new UserInputError('Error al obtener hotel');
        }
        
        const hotel = await response.json();
        return hotel;
      } catch (error) {
        console.error('Error en resolver getHotelById:', error);
        throw new UserInputError('Error al obtener hotel');
      }
    },
    
    /**
     * Obtener hoteles destacados para mostrar en la página principal
     */
    getHotelesDestacados: async (_, { limit }, { services, fetch }) => {
        try {
          // Construir URL con límite opcional
          const url = limit 
            ? `${services.reservas}/api/hotels/destacados?limit=${limit}`
            : `${services.reservas}/api/hotels/destacados`;
          
          console.log(`Fetching from: ${url}`); // Log para depuración
          
          // Realizar solicitud al microservicio de Reservas
          const response = await fetch(url);
          
          if (!response.ok) {
            console.error(`Error response from service: ${response.status} ${response.statusText}`);
            return []; // Devolver array vacío en caso de error
          }
          
          const data = await response.json();
          console.log(`Received data type: ${typeof data}, isArray: ${Array.isArray(data)}`);
          
          // Asegurar que la respuesta es un array
          if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return []; // Devolver array vacío si la respuesta no es un array
          }
          
          return data;
        } catch (error) {
          console.error('Error en resolver getHotelesDestacados:', error);
          return []; // Devolver array vacío en caso de excepción
        }
      }
  },
  
  // Resolvers para campos complejos o relaciones
  Hotel: {
    // Resolver para habitaciones de un hotel
    habitaciones: async (parent, args, { services, fetch }) => {
      // Si ya tenemos las habitaciones del hotel, devolverlas
      if (parent.habitaciones) {
        return parent.habitaciones;
      }
      
      try {
        // Realizar solicitud al microservicio de Reservas
        const response = await fetch(`${services.reservas}/api/rooms/hotel/${parent.id}`);
        
        if (!response.ok) {
          console.error('Error al obtener habitaciones del hotel:', response.statusText);
          return [];
        }
        
        const habitaciones = await response.json();
        return habitaciones;
      } catch (error) {
        console.error('Error al resolver habitaciones del hotel:', error);
        return [];
      }
    }
  }
};

export default hotelResolvers;