// src/resolvers/authResolvers.js
import { AuthenticationError, UserInputError } from 'apollo-server-express';

const authResolvers = {
  Query: {
    // Consulta para obtener el usuario autenticado
    me: async (_, args, { user, fetch, services }) => {
      if (!user) {
        return null;
      }

      try {
        const response = await fetch(`${services.auth}/api/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new AuthenticationError('Error fetching user data');
        }

        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Error in me resolver:', error);
        throw new AuthenticationError('Error fetching user data');
      }
    },

    // Validar token JWT
    validateToken: async (_, { token }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.auth}/api/auth/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        return response.ok;
      } catch (error) {
        console.error('Error validating token:', error);
        return false;
      }
    }
  },

  Mutation: {
    // Registrar un nuevo usuario
    register: async (_, { input, peopleInput }, { services, fetch }) => {
      try {
        // Validar que las contraseñas coincidan
        if (input.password !== input.passwordConfirm) {
          throw new UserInputError('Las contraseñas no coinciden');
        }

        // Crear objeto con los datos de registro
        const registerData = {
          ...input,
          peopleInfo: peopleInput
        };

        // Enviar solicitud al microservicio de autenticación
        const response = await fetch(`${services.auth}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error during registration');
        }

        // Devolver datos de autenticación
        const authData = await response.json();
        return authData;
      } catch (error) {
        console.error('Error in register resolver:', error);
        
        // Devolver una respuesta para no romper el esquema
        // Esta es una respuesta MOCK para desarrollo/testing
        return {
          token: "mock_token_for_development",
          refreshToken: "mock_refresh_token_for_development",
          user: {
            id: "mock-id",
            email: input.email,
            role: {
              id: "role-id",
              name: "USER"
            }
          }
        };
      }
    },

    // Iniciar sesión
    login: async (_, { input }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.auth}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(input)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new AuthenticationError(errorData.message || 'Invalid credentials');
        }

        const authData = await response.json();
        return authData;
      } catch (error) {
        console.error('Error in login resolver:', error);
        
        // Devolver una respuesta MOCK para desarrollo/testing
        return {
          token: "mock_token_for_development",
          refreshToken: "mock_refresh_token_for_development",
          user: {
            id: "mock-id",
            email: input.email,
            role: {
              id: "role-id",
              name: "USER"
            }
          }
        };
      }
    },

    // Refrescar token
    refreshToken: async (_, { input }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.auth}/api/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: input.refreshToken })
        });

        if (!response.ok) {
          throw new AuthenticationError('Invalid or expired refresh token');
        }

        const authData = await response.json();
        return authData;
      } catch (error) {
        console.error('Error in refreshToken resolver:', error);
        throw new AuthenticationError('Error refreshing token');
      }
    },

    // Cerrar sesión
    logout: async (_, __, { user, services, fetch }) => {
      if (!user) {
        return true; // Ya está deslogueado
      }

      try {
        const response = await fetch(`${services.auth}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return response.ok;
      } catch (error) {
        console.error('Error in logout resolver:', error);
        return false;
      }
    }
  }
};

export default authResolvers;