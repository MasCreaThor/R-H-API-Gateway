// src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8080';

/**
 * Middleware para extraer y verificar el token JWT de los headers
 * @param {Object} req - Objeto Request de Express
 * @returns {Object|null} - Payload del token JWT descodificado o null si no hay token válido
 */
export const authenticate = async (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Verificación básica del token con la clave secreta
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Validación adicional con el servicio de autenticación
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      console.error('Token validation failed in Auth service');
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Authentication error:', error.message);
    return null; // No lanzamos error para permitir operaciones públicas
  }
};

/**
 * Función para verificar si un usuario tiene los roles requeridos
 * @param {Object} user - Usuario autenticado
 * @param {Array} roles - Roles permitidos
 * @returns {Boolean} - true si el usuario tiene permiso
 * @throws {AuthenticationError} - Si el usuario no tiene permiso
 */
export const checkRole = (user, roles) => {
  if (!user) {
    throw new AuthenticationError('Debe estar autenticado para acceder a este recurso');
  }
  
  const userRole = user.role.name;
  
  if (roles.length > 0 && !roles.includes(userRole)) {
    throw new AuthenticationError(`Se requiere rol ${roles.join(' o ')} para acceder a este recurso`);
  }
  
  return true;
};