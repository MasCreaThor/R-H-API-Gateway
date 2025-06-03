// src/index.js
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import dotenv from 'dotenv';
import typeDefs from './typeDefs/index.js';
import resolvers from './resolvers/index.js';
import { authenticate } from './middlewares/auth.js';
import { applyAuthDirectives } from './directives/authDirectives.js';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

// Carga variables de entorno
dotenv.config();

// Puerto y URLs de servicios
const PORT = process.env.PORT || 4000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8080';
const RESERVAS_SERVICE_URL = process.env.RESERVAS_SERVICE_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

async function startApolloServer() {
  // Aplicación Express
  const app = express();
  
  // Middleware CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Permitir origen del frontend o cualquiera en desarrollo
    credentials: true // Habilitar cookies/credentials para autenticación
  }));
  
  // Middleware para parsear JSON
  app.use(express.json());

  // Crear schema con directivas
  let schema = makeExecutableSchema({ typeDefs, resolvers });
  
  // Aplicar todas las directivas de autenticación
  schema = applyAuthDirectives(schema);
  
  // Servidor Apollo
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      let user = null;
      if (token) {
        try {
          user = jwt.verify(token, JWT_SECRET);
          console.log('[API-GATEWAY] Usuario decodificado:', user);
        } catch (err) {
          console.error('[API-GATEWAY] JWT verification error:', err.message);
          user = null;
        }
      } else {
        console.log('[API-GATEWAY] No se recibió token');
      }
      
      return {
        // ...otros contextos...
        token,
        user,
        services: {
          auth: AUTH_SERVICE_URL,
          reservas: RESERVAS_SERVICE_URL
        },
        // Cliente fetch para comunicación con microservicios
        fetch: async (url, options = {}) => {
          // Determinar si es una ruta pública de autenticación
          const isPublicAuthEndpoint = 
            url.includes('/api/auth/register') || 
            url.includes('/api/auth/login') || 
            url.includes('/api/auth/refresh-token') ||
            url.includes('/api/auth/validate-token');
          
          // Añadir token de autenticación si existe y no es una ruta pública
          if (token && !isPublicAuthEndpoint) {
            options.headers = {
              ...options.headers,
              'Authorization': `Bearer ${token}`
            };
          }
          return fetch(url, options);
        },
        req,
      };
    },
    formatError: (error) => {
      // Personalizar mensajes de error
      console.error('GraphQL Error:', error);
      
      // No exponer detalles internos en producción
      if (process.env.NODE_ENV === 'production') {
        if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
          return {
            message: 'Error interno del servidor',
            extensions: { code: error.extensions.code }
          };
        }
      }
      
      // Devolver error completo en desarrollo
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
        extensions: error.extensions,
      };
    },
    // Habilitar playground en entorno de desarrollo
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
  });

  // Iniciar Apollo Server
  await server.start();
  
  // Aplicar middleware de Apollo a Express
  server.applyMiddleware({ 
    app,
    cors: false, // Ya configuramos CORS a nivel de Express
    path: '/graphql'
  });

  // Ruta básica para verificar que el servidor está funcionando
  app.get('/', (req, res) => {
    res.json({ 
      message: 'API Gateway for Hotel Booking App',
      graphqlEndpoint: `http://localhost:${PORT}${server.graphqlPath}`,
      status: 'running'
    });
  });

  // Ruta de estado para verificar la conexión con microservicios
  app.get('/health', async (req, res) => {
    try {
      // Verificar conexión con Auth Service
      const authResponse = await fetch(`${AUTH_SERVICE_URL}/actuator/health`, { timeout: 3000 })
        .then(r => r.ok ? { status: 'UP' } : { status: 'DOWN' })
        .catch(() => ({ status: 'DOWN' }));
      
      // Verificar conexión con Reservas Service
      const reservasResponse = await fetch(`${RESERVAS_SERVICE_URL}/health`, { timeout: 3000 })
        .then(r => r.ok ? { status: 'UP' } : { status: 'DOWN' })
        .catch(() => ({ status: 'DOWN' }));
      
      res.json({
        status: 'UP',
        services: {
          auth: authResponse.status,
          reservas: reservasResponse.status
        }
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'DOWN',
        error: error.message
      });
    }
  });

  // Iniciar servidor Express
  app.listen(PORT, () => {
    console.log(`
🚀 API Gateway running at http://localhost:${PORT}
📡 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}
🔐 Auth Service: ${AUTH_SERVICE_URL}
🏨 Reservas Service: ${RESERVAS_SERVICE_URL}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
    `);
  });
}

// Iniciar servidor
startApolloServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});