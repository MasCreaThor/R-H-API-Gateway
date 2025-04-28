# Guía de Pruebas API - Hotel Booking App

Esta guía describe cómo probar los endpoints de autenticación de la API GraphQL para la aplicación de reserva de hoteles utilizando Postman.

## Índice

- [Configuración de Postman](#configuración-de-postman)
- [Probar Registro de Usuario](#probar-registro-de-usuario)
- [Probar Inicio de Sesión](#probar-inicio-de-sesión)
- [Autenticación en Solicitudes Protegidas](#autenticación-en-solicitudes-protegidas)
- [Solución de Problemas Comunes](#solución-de-problemas-comunes)

## Configuración de Postman

1. **Instalar y abrir Postman**

2. **Crear una nueva solicitud**:
   - Clic en `New` > `HTTP Request`
   - Método: `POST`
   - URL: `http://localhost:4000/graphql`

3. **Configurar Headers**:
   - Key: `Content-Type`
   - Value: `application/json`

4. **Configurar Body**:
   - Seleccionar formato: `raw`
   - Tipo: `JSON`

## Probar Registro de Usuario

### Solicitud

1. **Configurar Body**:

```json
{
  "query": "mutation Register($input: RegisterInput!, $peopleInput: PeopleInput!) { register(input: $input, peopleInput: $peopleInput) { token refreshToken user { id email role { name } } } }",
  "variables": {
    "input": {
      "email": "usuario@example.com",
      "password": "contraseña123",
      "passwordConfirm": "contraseña123"
    },
    "peopleInput": {
      "nombre": "Juan",
      "apellido": "Pérez",
      "telefono": "123456789"
    }
  }
}
```

1. **Enviar la solicitud**:
   - Clic en `Send`

### Respuesta Exitosa

```json
{
  "data": {
    "register": {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "a85c9358-61c0-4...",
      "user": {
        "id": "64e91f3cb3b9784e3b8d0a1c",
        "email": "usuario@example.com",
        "role": {
          "name": "USER"
        }
      }
    }
  }
}
```

## Probar Inicio de Sesión

### Solicitud

1. **Configurar Body**:

```json
{
  "query": "mutation Login($input: LoginInput!) { login(input: $input) { token refreshToken user { id email role { name } } } }",
  "variables": {
    "input": {
      "email": "usuario@example.com",
      "password": "contraseña123"
    }
  }
}
```

1. **Enviar la solicitud**:
   - Clic en `Send`

### Respuesta Exitosa

```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "e8f2d47c-9a12-4...",
      "user": {
        "id": "64e91f3cb3b9784e3b8d0a1c",
        "email": "usuario@example.com",
        "role": {
          "name": "USER"
        }
      }
    }
  }
}
```

## Autenticación en Solicitudes Protegidas

Para acceder a endpoints protegidos, debes incluir el token JWT en el header de autorización:

1. **Guardar el token**:
   - Después del login, guarda el token JWT devuelto

2. **Configurar Headers para solicitudes protegidas**:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiJ9...` (incluir el token obtenido)

3. **Ejemplo de solicitud protegida**:

```json
{
  "query": "query { me { id email role { name } } }"
}
```

## Solución de Problemas Comunes

### Error: "Las contraseñas no coinciden"

- **Causa**: Los campos `password` y `passwordConfirm` en la solicitud de registro tienen valores diferentes
- **Solución**: Asegúrate de que ambos campos contengan exactamente el mismo valor

### Error: "Email ya está en uso"

- **Causa**: Ya existe un usuario con la dirección de correo electrónico proporcionada
- **Solución**: Usa un correo electrónico diferente o recupera la contraseña si es tu cuenta

### Error: "Credenciales inválidas"

- **Causa**: El correo o la contraseña proporcionados son incorrectos
- **Solución**: Verifica que estés usando las credenciales correctas

### Error: GraphQL no encuentra el campo

- **Causa**: El nombre de un campo en la consulta está mal escrito o no existe
- **Solución**: Revisa la consulta GraphQL y asegúrate de que todos los campos existan en el esquema

### No se puede acceder a rutas protegidas

- **Causa**: El token JWT no está incluido o ha expirado
- **Solución**: Asegúrate de incluir el token en el header de autorización como `Bearer [token]`. Si ha expirado, realiza login nuevamente

## Tips para Testeo Efectivo

1. **Guarda tus consultas**:
   - En Postman, guarda las solicitudes en una colección para facilitar las pruebas futuras

2. **Usa variables de entorno**:
   - Configura la URL base y tokens como variables de entorno para cambiar fácilmente entre entornos

3. **Organiza por carpetas**:
   - Agrupa las solicitudes relacionadas (auth, reservas, hoteles) en carpetas separadas

4. **Realiza pruebas de integración**:
   - Prueba flujos completos: registro > login > realizar reserva > cancelar reserva

5. **Verifica respuestas de error**:
   - Prueba casos negativos para asegurar que la API maneja correctamente los errores
