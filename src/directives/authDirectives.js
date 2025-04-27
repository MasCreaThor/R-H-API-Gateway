import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

/**
 * Crea la directiva @auth para proteger rutas que requieren autenticación
 */
export function authDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];
      
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        
        fieldConfig.resolve = async function (source, args, context, info) {
          if (!context.user) {
            throw new AuthenticationError('You must be logged in to access this resource');
          }
          
          return resolve(source, args, context, info);
        };
      }
      
      return fieldConfig;
    },
  });
}

/**
 * Crea la directiva @hasRole para verificar roles específicos
 */
export function hasRoleDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const hasRoleDirective = getDirective(schema, fieldConfig, 'hasRole')?.[0];
      
      if (hasRoleDirective) {
        const { role } = hasRoleDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;
        
        fieldConfig.resolve = async function (source, args, context, info) {
          if (!context.user) {
            throw new AuthenticationError('You must be logged in to access this resource');
          }
          
          // Verificar si el usuario tiene uno de los roles permitidos
          const userRole = context.user.role?.name;
          if (!userRole || !role.includes(userRole)) {
            throw new ForbiddenError(`You need ${role.join(' or ')} role to access this resource`);
          }
          
          return resolve(source, args, context, info);
        };
      }
      
      return fieldConfig;
    },
  });
}