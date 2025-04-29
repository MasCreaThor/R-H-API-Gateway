// src/resolvers/categoryResolvers.js
import { UserInputError } from 'apollo-server-express';

const categoryResolvers = {
  Query: {
    /**
     * Obtener todas las categorías de hotel
     */
    getCategorias: async (_, __, { services, fetch }) => {
      try {
        const response = await fetch(`${services.reservas}/api/categories`);
        
        if (!response.ok) {
          throw new Error('Error al obtener categorías de hotel');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getCategorias:', error);
        throw new Error('Error al obtener categorías de hotel');
      }
    },

    /**
     * Obtener una categoría específica por ID
     */
    getCategoriaById: async (_, { id }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.reservas}/api/categories/${id}`);
        
        if (response.status === 404) {
          return null;
        }
        
        if (!response.ok) {
          throw new Error('Error al obtener la categoría');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getCategoriaById:', error);
        throw new Error('Error al obtener información de la categoría');
      }
    },

    /**
     * Obtener o crear una categoría por número de estrellas
     */
    getCategoriaByEstrellas: async (_, { estrellas }, { services, fetch }) => {
      try {
        // Validar que estrellas es un número entre 1 y 5
        if (estrellas < 1 || estrellas > 5) {
          throw new UserInputError('El número de estrellas debe estar entre 1 y 5');
        }

        const response = await fetch(`${services.reservas}/api/categories/estrellas/${estrellas}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener la categoría por estrellas');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error en resolver getCategoriaByEstrellas:', error);
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Error al obtener la categoría por estrellas');
      }
    }
  }
};

export default categoryResolvers;