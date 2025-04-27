// src/resolvers/peopleResolvers.js
import { AuthenticationError, UserInputError } from 'apollo-server-express';

const peopleResolvers = {
  Query: {
    /**
     * Obtener información personal del usuario autenticado
     */
    getPeopleInfo: async (_, __, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para acceder a esta información');
      }

      try {
        const response = await fetch(`${services.auth}/api/people/me`);

        if (!response.ok) {
          throw new Error('Error al obtener información personal');
        }

        const peopleData = await response.json();
        return peopleData;
      } catch (error) {
        console.error('Error en resolver getPeopleInfo:', error);
        throw new Error('Error al obtener información personal');
      }
    },

    /**
     * Admin: Obtener información personal por ID de usuario
     */
    getPeopleByUserId: async (_, { userId }, { user, services, fetch }) => {
      // Esta verificación se hará también mediante directiva @hasRole
      if (!user || user.role.name !== 'ADMIN') {
        throw new AuthenticationError('No tiene permisos para acceder a esta información');
      }

      try {
        const response = await fetch(`${services.auth}/api/people/user/${userId}`);

        if (!response.ok) {
          throw new Error('Error al obtener información personal');
        }

        const peopleData = await response.json();
        return peopleData;
      } catch (error) {
        console.error('Error en resolver getPeopleByUserId:', error);
        throw new UserInputError('Error al obtener datos personales');
      }
    },

    /**
     * Admin: Listar toda la información personal
     */
    getAllPeople: async (_, __, { user, services, fetch }) => {
      // Esta verificación se hará también mediante directiva @hasRole
      if (!user || user.role.name !== 'ADMIN') {
        throw new AuthenticationError('No tiene permisos para acceder a esta información');
      }

      try {
        const response = await fetch(`${services.auth}/api/people`);

        if (!response.ok) {
          throw new Error('Error al obtener lista de personas');
        }

        const peopleList = await response.json();
        return peopleList;
      } catch (error) {
        console.error('Error en resolver getAllPeople:', error);
        return [];
      }
    },
  },

  Mutation: {
    /**
     * Actualizar información personal del usuario autenticado
     */
    updatePeopleInfo: async (_, { input }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para actualizar su información');
      }

      try {
        const response = await fetch(`${services.auth}/api/people/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al actualizar información personal');
        }

        const updatedPeople = await response.json();
        return updatedPeople;
      } catch (error) {
        console.error('Error en resolver updatePeopleInfo:', error);
        throw new UserInputError(error.message || 'Error al actualizar información personal');
      }
    },
  },

  // Resolver para campo calculado
  People: {
    nombreCompleto: (parent) => {
      return `${parent.nombre} ${parent.apellido}`;
    },
  },
};

export default peopleResolvers;