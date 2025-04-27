// src/directives/authDirectives.js
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

/**
 * Directiva @auth para proteger campos que requieren autenticación
 * Aplica esta transformación al esquema GraphQL
 * @param {Object} schema - Esquema GraphQL
 * @returns {Object} - Esquema transformado
 */
export function authDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];
      
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        
        // Reemplazar el resolver original con uno que valida la autenticación
        fieldConfig.resolve = async function (source, args, context, info) {
          if (!context.user) {
            throw new AuthenticationError('Debe estar autenticado para acceder a este recurso');
          }
          
          return resolve(source, args, context, info);
        };
      }
      
      return fieldConfig;
    },
  });
}

/**
 * Directiva @hasRole para proteger campos que requieren roles específicos
 * Aplica esta transformación al esquema GraphQL
 * @param {Object} schema - Esquema GraphQL
 * @returns {Object} - Esquema transformado
 */
export function hasRoleDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const hasRoleDirective = getDirective(schema, fieldConfig, 'hasRole')?.[0];
      
      if (hasRoleDirective) {
        const { role } = hasRoleDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;
        
        // Reemplazar el resolver original con uno que valida el rol
        fieldConfig.resolve = async function (source, args, context, info) {
          if (!context.user) {
            throw new AuthenticationError('Debe estar autenticado para acceder a este recurso');
          }
          
          // Verificar si el usuario tiene uno de los roles permitidos
          const userRole = context.user.role?.name;
          if (!userRole || !role.includes(userRole)) {
            throw new ForbiddenError(
              `Se requiere rol ${role.join(' o ')} para acceder a este recurso. Su rol es: ${userRole}`
            );
          }
          
          return resolve(source, args, context, info);
        };
      }
      
      return fieldConfig;
    },
  });
}