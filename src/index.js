import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import dotenv from 'dotenv';
import typeDefs from './typeDefs/index.js';
import resolvers from './resolvers/index.js';
import { authenticate } from './middlewares/auth.js';
import { authDirectiveTransformer, hasRoleDirectiveTransformer } from './directives/authDirectives.js';
import fetch from 'node-fetch';

// Carga variables de entorno
dotenv.config();

// Puerto
const PORT = process.env.PORT || 4000;
// URLs de servicios
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8080';
const RESERVAS_SERVICE_URL = process.env.RESERVAS_SERVICE_URL || 'http://localhost:3000';

async function startApolloServer() {
  // Aplicación Express
  const app = express();
  
  // Middleware CORS
  app.use(cors());
  
  // Middleware para parsear JSON
  app.use(express.json());

  // Crear schema con directivas
  let schema = makeExecutableSchema({ typeDefs, resolvers });
  
  // Aplicar transformadores de directivas
  schema = authDirectiveTransformer(schema);
  schema = hasRoleDirectiveTransformer(schema);
  
  // Servidor Apollo
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      // Extraer y verificar el token JWT
      const user = await authenticate(req);
      
      // Incluir URLs de los servicios y el usuario autenticado en el contexto
      return { 
        req, 
        user, 
        services: {
          auth: AUTH_SERVICE_URL,
          reservas: RESERVAS_SERVICE_URL
        },
        // Cliente fetch para comunicación con microservicios
        fetch: async (url, options = {}) => {
          // Añadir token de autenticación si existe
          if (user) {
            options.headers = {
              ...options.headers,
              'Authorization': req.headers.authorization
            };
          }
          return fetch(url, options);
        }
      };
    },
    formatError: (error) => {
      // Personalizar mensajes de error
      console.error('GraphQL Error:', error);
      
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
        extensions: error.extensions,
      };
    },
    // Habilitar playground en entorno de desarrollo
    introspection: true,
    playground: process.env.NODE_ENV !== 'production',
  });

  // Iniciar Apollo Server
  await server.start();
  
  // Aplicar middleware de Apollo a Express
  server.applyMiddleware({ app });

  // Ruta básica para verificar que el servidor está funcionando
  app.get('/', (req, res) => {
    res.json({ message: 'API Gateway for Hotel Booking App' });
  });

  // Iniciar servidor Express
  app.listen(PORT, () => {
    console.log(`
    🚀 API Gateway running at http://localhost:${PORT}${server.graphqlPath}
    📡 Connected to Auth Service at ${AUTH_SERVICE_URL}
    📡 Connected to Reservas Service at ${RESERVAS_SERVICE_URL}
    `);
  });
}

// Iniciar servidor
startApolloServer().catch(err => {
  console.error('Error starting server:', err);
});