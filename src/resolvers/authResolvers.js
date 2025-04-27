// src/resolvers/authResolvers.js
import { AuthenticationError, UserInputError } from 'apollo-server-express';

const authResolvers = {
  Query: {
    /**
     * Consulta para obtener el usuario autenticado actual
     */
    me: async (_, args, { user, fetch, services }) => {
      if (!user) {
        return null;
      }

      try {
        const response = await fetch(`${services.auth}/api/users/me`);

        if (!response.ok) {
          throw new AuthenticationError('Error al obtener datos del usuario');
        }

        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Error en resolver me:', error);
        throw new AuthenticationError('Error al obtener datos del usuario');
      }
    },

    /**
     * Validar si un token JWT es válido
     */
    validateToken: async (_, { token }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.auth}/api/auth/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        return response.ok;
      } catch (error) {
        console.error('Error al validar token:', error);
        return false;
      }
    },
  },

  Mutation: {
    /**
     * Registrar un nuevo usuario con información personal
     */
    register: async (_, { input, peopleInput }, { services, fetch }) => {
      try {
        // Validar que las contraseñas coincidan
        if (input.password !== input.passwordConfirm) {
          throw new UserInputError('Las contraseñas no coinciden');
        }

        // Crear objeto con datos completos para registro
        const registerData = {
          ...input,
          peopleInfo: peopleInput,
        };

        // Enviar solicitud al microservicio de autenticación
        const response = await fetch(`${services.auth}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error durante el registro');
        }

        // Devolver datos de autenticación
        const authData = await response.json();
        
        // Asegurarse de que la respuesta tenga la estructura esperada
        if (!authData.token || !authData.refreshToken) {
          console.log("Estructura de respuesta recibida:", JSON.stringify(authData, null, 2));
          
          // Si el usuario se registró pero falta información en la respuesta, 
          // intentamos iniciar sesión manualmente
          const loginResponse = await fetch(`${services.auth}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: input.email,
              password: input.password
            }),
          });
          
          if (!loginResponse.ok) {
            throw new UserInputError('Usuario registrado pero no se pudo iniciar sesión automáticamente');
          }
          
          return await loginResponse.json();
        }
        
        return {
          token: authData.token,
          refreshToken: authData.refreshToken,
          user: {
            id: authData.id || authData.user?.id,
            email: authData.email || authData.user?.email,
            role: {
              name: authData.role || authData.user?.role
            }
          }
        };
      } catch (error) {
        console.error('Error en resolver register:', error);
        throw new UserInputError(error.message || 'Error durante el registro');
      }
    },

    /**
     * Iniciar sesión de usuario
     */
    login: async (_, { input }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.auth}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new AuthenticationError(errorData.message || 'Credenciales inválidas');
        }

        const authData = await response.json();
        
        // Transformar la respuesta para que coincida con el esquema GraphQL
        return {
          token: authData.token,
          refreshToken: authData.refreshToken,
          user: {
            id: authData.id || authData.user?.id,
            email: authData.email || authData.user?.email,
            role: {
              name: authData.role || authData.user?.role
            }
          }
        };
      } catch (error) {
        console.error('Error en resolver login:', error);
        throw new AuthenticationError(error.message || 'Error durante el inicio de sesión');
      }
    },

    /**
     * Refrescar un token expirado usando un refresh token
     */
    refreshToken: async (_, { input }, { services, fetch }) => {
      try {
        const response = await fetch(`${services.auth}/api/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: input.refreshToken }),
        });

        if (!response.ok) {
          throw new AuthenticationError('Token de refresco inválido o expirado');
        }

        const authData = await response.json();
        
        // Transformar la respuesta para coincidir con el esquema GraphQL
        return {
          token: authData.token || authData.accessToken,
          refreshToken: authData.refreshToken,
          user: {
            id: authData.id || authData.user?.id,
            email: authData.email || authData.user?.email,
            role: {
              name: authData.role || authData.user?.role
            }
          }
        };
      } catch (error) {
        console.error('Error en resolver refreshToken:', error);
        throw new AuthenticationError('Error al refrescar el token');
      }
    },

    /**
     * Cerrar sesión del usuario (invalidar refresh token)
     */
    logout: async (_, __, { user, services, fetch }) => {
      if (!user) {
        return true; // Ya está deslogueado
      }

      try {
        const response = await fetch(`${services.auth}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        return response.ok;
      } catch (error) {
        console.error('Error en resolver logout:', error);
        return false;
      }
    },

    /**
     * Cambiar contraseña de usuario
     */
    changePassword: async (_, { input }, { user, services, fetch }) => {
      if (!user) {
        throw new AuthenticationError('Debe estar autenticado para cambiar la contraseña');
      }

      try {
        // Validar que las nuevas contraseñas coincidan
        if (input.newPassword !== input.newPasswordConfirm) {
          throw new UserInputError('Las nuevas contraseñas no coinciden');
        }

        const response = await fetch(`${services.auth}/api/auth/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldPassword: input.oldPassword,
            newPassword: input.newPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new UserInputError(errorData.message || 'Error al cambiar la contraseña');
        }

        return true;
      } catch (error) {
        console.error('Error en resolver changePassword:', error);
        throw new UserInputError(error.message || 'Error al cambiar la contraseña');
      }
    },
  },
};

export default authResolvers;