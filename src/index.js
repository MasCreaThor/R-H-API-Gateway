import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import typeDefs from './typeDefs/index.js';
import resolvers from './resolvers/index.js';

// Carga variables de entorno
dotenv.config();

// Puerto
const PORT = process.env.PORT || 4000;

async function startApolloServer() {
  // Aplicación Express
  const app = express();
  
  // Middleware CORS
  app.use(cors());
  
  // Middleware para parsear JSON
  app.use(express.json());

  // Servidor Apollo
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Contexto para autenticación (se implementará después)
      return { req };
    },
  });

  // Iniciar Apollo Server
  await server.start();
  
  // Aplicar middleware de Apollo a Express
  server.applyMiddleware({ app });

  // Iniciar servidor Express
  app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Iniciar servidor
startApolloServer().catch(err => {
  console.error('Error starting server:', err);
});