// src/resolvers/peopleResolvers.js
import { AuthenticationError, UserInputError } from 'apollo-server-express';

const peopleResolvers = {
  Query: {
    // Obtener información personal del usuario autenticado
    getPeopleInfo: async (_, __, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to access this resource');
      }

      try {
        const response = await fetch(`${services.auth}/api/people/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch people information');
        }

        const peopleData = await response.json();
        return peopleData;
      } catch (error) {
        console.error('Error in getPeopleInfo resolver:', error);
        
        // Devolver una respuesta MOCK para desarrollo/testing
        return {
          id: "mock-people-id",
          userId: user.id,
          nombre: "Usuario",
          apellido: "De Prueba",
          telefono: "123456789",
          nombreCompleto: "Usuario De Prueba",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    },

    // Admin: Obtener información personal por ID de usuario
    getPeopleByUserId: async (_, { userId }, { user, services, fetch }) => {
      try {
        const response = await fetch(`${services.auth}/api/people/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch people information');
        }

        const peopleData = await response.json();
        return peopleData;
      } catch (error) {
        console.error('Error in getPeopleByUserId resolver:', error);
        throw new UserInputError('Error fetching people data');
      }
    },

    // Admin: Listar toda la información personal
    getAllPeople: async (_, __, { services, fetch }) => {
      try {
        const response = await fetch(`${services.auth}/api/people`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch people information');
        }

        const peopleList = await response.json();
        return peopleList;
      } catch (error) {
        console.error('Error in getAllPeople resolver:', error);
        return []; // Devolver lista vacía en caso de error
      }
    }
  },

  Mutation: {
    // Actualizar información personal
    updatePeopleInfo: async (_, { input }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to update your information');
      }

      try {
        const response = await fetch(`${services.auth}/api/people/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(input)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error updating people information');
        }

        const updatedPeople = await response.json();
        return updatedPeople;
      } catch (error) {
        console.error('Error in updatePeopleInfo resolver:', error);
        
        // Devolver una respuesta MOCK para desarrollo/testing
        return {
          id: "mock-people-id",
          userId: user.id,
          nombre: input.nombre,
          apellido: input.apellido,
          telefono: input.telefono,
          nombreCompleto: `${input.nombre} ${input.apellido}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    }
  },

  // Resolver para el campo calculado nombreCompleto
  People: {
    nombreCompleto: (parent) => {
      return `${parent.nombre} ${parent.apellido}`;
    }
  }
};

export default peopleResolvers;