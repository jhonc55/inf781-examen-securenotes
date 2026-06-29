# SecureNotes API

API REST segura desarrollada con NestJS, PostgreSQL, TypeORM, JWT y Argon2 para la asignatura **INF-781 Seguridad de Software**.

## Tecnologías utilizadas

* NestJS 11
* PostgreSQL
* TypeORM
* JWT (Access Token y Refresh Token)
* Passport JWT
* Argon2
* Class Validator
* Class Transformer

---

## Requisitos previos

Antes de ejecutar el proyecto, tener instalado:

* Node.js 20 LTS o superior
* PostgreSQL 14 o superior
* npm

Verificar versiones:

```bash
node -v
npm -v
```

---

## Instalación del proyecto

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd inf781-examen-securenotes
```

Instalar dependencias:

```bash
npm install
```

---

## Configuración de la base de datos

Crear una base de datos PostgreSQL llamada:

```sql
CREATE DATABASE securenotes;
```

---

## Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=123456
DATABASE_NAME=securenotes

JWT_ACCESS_SECRET=MiSuperAccessSecret2026
JWT_REFRESH_SECRET=MiSuperRefreshSecret2026

JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

---

## Ejecución del proyecto

Iniciar el servidor en modo desarrollo:

```bash
npm run start:dev
```

Si la configuración es correcta, NestJS iniciará en:

```text
http://localhost:3000
```

---

## Endpoints disponibles

### Autenticación

| Método | Endpoint       | Descripción                |
| ------ | -------------- | -------------------------- |
| POST   | /auth/register | Registro de usuarios       |
| POST   | /auth/login    | Inicio de sesión           |
| POST   | /auth/logout   | Cierre de sesion           |
| POST   | /auth/refresh  | Renovación de access token |
| GET    | /auth/me       | Usuario autenticado        |


### Notas

| Método | Endpoint   |
| ------ | ---------- |
| POST   | /notes     |
| GET    | /notes     |
| GET    | /notes/:id |
| PATCH  | /notes/:id |
| DELETE | /notes/:id |

Todas las rutas de notas requieren autenticación mediante Bearer Token.

---

## Autenticación

Agregar el Access Token en el encabezado:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

## Seguridad implementada

* Hashing de contraseñas con Argon2.
* Validación mediante DTOs.
* ValidationPipe global.
* JWT Access Token.
* JWT Refresh Token.
* Protección de rutas con Guards.
* Control de acceso por propietario (anti-IDOR).
* Exclusión del campo password en respuestas.
* Persistencia de Refresh Tokens.

---

## Autor

Jhon Calixto Mamani Mamani

INF-781 – Seguridad de Software

Universidad Autónoma Tomás Frías
