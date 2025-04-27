# API Gateway para Reserva de Hoteles

API Gateway implementado con Apollo Server, GraphQL y Express para la aplicación de reserva de hoteles. Este componente actúa como punto de entrada unificado para el frontend, gestionando la comunicación con los microservicios y proporcionando una API GraphQL consistente.

## Características

- **GraphQL API unificada** para todos los microservicios
- **Sistema de autenticación basado en JWT**
- **Control de acceso basado en roles** (ADMIN, USER, HOTEL_MANAGER)
- **Directivas GraphQL** para proteger resolvers
- **Comunicación segura** entre microservicios

## Requisitos

- Node.js (v14 o superior)
- npm
- Microservicios Auth y Reservas en ejecución

## Instalación

1. Clonar el repositorio

   ```bash
   git clone https://github.com/tu-org/api-gateway.git
   cd api-gateway
   ```

2. Instalar dependencias

   ```bash
   npm install
   ```

3. Configurar el entorno

   ```bash
   cp .env.example .env
   # Editar el archivo .env con los valores adecuados
   ```

4. Iniciar en modo desarrollo

   ```bash
   npm run dev
   ```

## Estructura del proyecto

```bash
/src
  /directives       # Directivas GraphQL para autenticación
  /middlewares      # Middlewares Express, incluido autenticación
  /resolvers        # Resolvers GraphQL
  /typeDefs         # Definiciones de tipos GraphQL
  index.js          # Punto de entrada de la aplicación
```

## Flujo de autenticación

### Registro

1. El cliente envía información de registro al mutation `register`
2. El API Gateway reenvía los datos al microservicio Auth
3. Se crea usuario, genera tokens y se almacena información personal
4. Se devuelve AuthPayload (token, refreshToken, user)

### Login

1. El cliente envía credenciales al mutation `login`
2. El API Gateway reenvía los datos al microservicio Auth
3. El servicio Auth verifica las credenciales y genera tokens
4. Se devuelve AuthPayload (token, refreshToken, user)

### Autorización

1. El cliente incluye el token JWT en el header `Authorization: Bearer <token>`
2. El middleware de autenticación valida el token
3. Las directivas `@auth` y `@hasRole` protegen consultas/mutaciones
4. Si el token expira, el cliente puede usar `refreshToken` para obtener uno nuevo

## Integración con frontend

Para conectar un frontend a este API Gateway:

1. Configurar Apollo Client:
   ```javascript

   import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
   import { setContext } from '@apollo/client/link/context';

   // Enlace HTTP básico
   const httpLink = createHttpLink({
     uri: 'http://localhost:4000/graphql',
   });

   // Middleware de autenticación
   const authLink = setContext((_, { headers }) => {
     const token = localStorage.getItem('token');
     return {
       headers: {
         ...headers,
         authorization: token ? `Bearer ${token}` : "",
       }
     }
   });

   // Cliente Apollo
   const client = new ApolloClient({
     link: authLink.concat(httpLink),
     cache: new InMemoryCache()
   });
   ```

2. Gestionar el token y refresh token:
   - Almacenar tokens en localStorage o cookies seguras
   - Implementar interceptor para refrescar token expirado
   - Actualizar token en cada respuesta exitosa de login/registro

3. Implementar rutas protegidas en el frontend utilizando el resultado de la consulta `me`

## Ejemplos de consultas

### Registro de usuario

```graphql
mutation Register($input: RegisterInput!, $peopleInput: PeopleInput!) {
  register(input: $input, peopleInput: $peopleInput) {
    token
    refreshToken
    user {
      id
      email
      role {
        name
      }
    }
  }
}
```

### Login

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    refreshToken
    user {
      id
      email
      role {
        name
      }
    }
  }
}
```

### Obtener información del usuario autenticado

```graphql
query Me {
  me {
    id
    email
    role {
      name
    }
    people {
      nombre
      apellido
      nombreCompleto
    }
  }
}
```

## Seguridad

- Los tokens JWT están firmados con una clave secreta
- Las contraseñas nunca se envían en texto plano
- Las mutaciones sensibles están protegidas con directivas `@auth` y `@hasRole`
- Se validan los datos de entrada para prevenir inyecciones
- Se implementa rate limiting para prevenir abusos

## Desarrollo futuro

- Implementar caché con Redis para consultas frecuentes
- Configurar CI/CD para despliegue automático
