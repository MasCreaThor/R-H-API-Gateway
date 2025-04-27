// src/middlewares/auth.js

import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8080';

/**
 * Middleware para extraer y verificar el token JWT de los headers
 * @param {Object} req - Request de Express
 * @returns {Object|null} - Payload del token o null si no hay token
 */
export const authenticate = async (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Primero verificamos básicamente el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Luego validamos con el servicio de autenticación
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new AuthenticationError('Token validation failed');
    }
    
    return decoded;
  } catch (error) {
    console.error('Authentication error:', error);
    return null; // No lanzamos error para permitir operaciones públicas
  }
};

/**
 * Middleware para verificar roles de usuario
 * @param {Object} user - Usuario autenticado
 * @param {Array} roles - Roles permitidos
 * @returns {Boolean} - True si el usuario tiene permiso
 */
export const checkRole = (user, roles) => {
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new AuthenticationError('Insufficient permissions');
  }
  
  return true;
};