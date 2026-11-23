# Library Management System

A backend REST API for managing a library catalogue, genres, user
accounts, and book inventory. Built with **NestJS**, **TypeScript**,
**Prisma ORM 7**, and **PostgreSQL** hosted on **Neon**.

The current implementation includes book and genre CRUD operations,
catalogue search and pagination, patron registration and login, JWT
authentication, and librarian-only authorization for book write
operations.

> **Status:** Catalogue API, authentication, and librarian authorization
> are implemented and manually verified. Borrowing, returns, and the
> frontend are planned future development.

------------------------------------------------------------------------

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Features](#2-features)
3.  [Technology Stack](#3-technology-stack)
4.  [Architecture](#4-architecture)
5.  [Repository Structure](#5-repository-structure)
6.  [Database Design](#6-database-design)
7.  [Getting Started](#7-getting-started)
8.  [Environment Configuration](#8-environment-configuration)
9.  [Database Setup](#9-database-setup)
10. [Running the API](#10-running-the-api)
11. [API Reference](#11-api-reference)
12. [Authentication and
    Authorization](#12-authentication-and-authorization)
13. [Postman Collection](#13-postman-collection)
14. [Validation and Error Handling](#14-validation-and-error-handling)
15. [Testing and Verification](#15-testing-and-verification)
16. [Security Notes](#16-security-notes)
17. [Current Implementation Status](#17-current-implementation-status)
18. [Planned Development](#18-planned-development)
19. [Design Decisions](#19-design-decisions)
20. [Learning Resources](#20-learning-resources)
21. [Author and Repository](#21-author-and-repository)

------------------------------------------------------------------------

## 1. Project Overview

The Library Management System is a backend engineering project developed
as part of a Full Stack Software Engineering learning programme.

It provides a structured API for managing a library's book catalogue and
genre classifications. It also supports user registration and login,
token-based authentication, and role-based access control for selected
operations.

The backend follows NestJS's modular architecture. Controllers expose
HTTP endpoints, services contain application logic, DTOs validate
incoming data, and a shared Prisma service provides database access.

### Project information

  Attribute              Details
  ---------------------- --------------------------------------
  Project name           Library Management System
  Repository             `library-management-system`
  Application type       Backend REST API
  Framework              NestJS
  Language               TypeScript
  ORM                    Prisma ORM 7
  Database               PostgreSQL
  Hosting                Neon
  Development database   `neondb` on the `development` branch
  Authentication         JWT bearer tokens
  Password hashing       bcrypt
  Authorization          Role-based access control
  Default API port       `3000`

## 2. Features

### Book catalogue

-   Create, retrieve, update, and delete book records.
-   Retrieve a book by ID.
-   Search books by title or author (case-insensitive).
-   Filter books by genre.
-   Paginate results using `page` and `limit`.
-   Include related genre information in book responses.
-   Track total and available copies.
-   Initialize available copies from total copies when creating a book.
-   Synchronize available copies when `totalCopies` is updated.

### Genre management

-   Create, retrieve, update, and delete genres.
-   Include the number of associated books in genre responses.
-   Prevent deletion of a genre while books still reference it.

### Authentication

-   Register patron accounts.
-   Log in using email and password.
-   Hash passwords using bcrypt before storing them.
-   Issue signed JWT access tokens after successful login.
-   Validate bearer tokens on protected routes.
-   Return safe user information without exposing password hashes.

### Authorization

-   Define `PATRON` and `LIBRARIAN` roles.
-   Restrict book creation, updating, and deletion to authenticated
    librarians.
-   Reject unauthenticated requests to protected book write routes.
-   Reject patrons attempting librarian-only operations.

### Developer support

-   Prisma migrations and database seeding.
-   Environment-based database and JWT configuration.
-   Global request validation and CORS configuration.
-   Importable Postman collection.

## 3. Technology Stack

  Technology                Purpose
  ------------------------- --------------------------------------
  Node.js                   JavaScript runtime
  TypeScript                Typed application development
  NestJS                    Backend framework
  Express                   HTTP platform used by NestJS
  PostgreSQL                Relational database
  Neon                      Hosted PostgreSQL
  Prisma ORM 7              Schema modelling and database access
  Prisma Client             Generated type-safe database client
  PrismaNeon adapter        Connects Prisma Client to Neon
  Prisma Migrate            Database migration management
  bcrypt                    Password hashing
  Passport / Passport JWT   Authentication strategy integration
  `@nestjs/jwt`             JWT signing and verification
  `class-validator`         DTO validation
  `class-transformer`       Request transformation
  Postman                   API testing
  Git / GitHub              Version control and source hosting

## 4. Architecture

The application uses a modular, layered backend structure.

``` mermaid
flowchart TD
    Client[API Client / Postman] --> Nest[NestJS Application]
    Nest --> Controller[Controller]
    Controller --> Guards[Authentication and Role Guards]
    Guards --> Service[Feature Service]
    Service --> PrismaService[PrismaService]
    PrismaService --> Client2[Generated Prisma Client]
    Client2 --> Adapter[PrismaNeon Driver Adapter]
    Adapter --> Database[(Neon PostgreSQL)]
```

### Main components

-   **Controllers:** Define HTTP routes, receive request data, and
    return responses.
-   **DTOs:** Define and validate incoming request data.
-   **Services:** Implement application logic and database operations.
-   **Modules:** Group related controllers and providers.
-   **Guards:** Protect routes using authentication and role checks.
-   **PrismaService:** Provides a shared Prisma Client through NestJS
    dependency injection.
-   **PrismaModule:** Registers and exports the database service.
-   **PrismaNeon adapter:** Connects Prisma Client to Neon PostgreSQL.

### Feature modules

  -----------------------------------------------------------------------
  Module                              Responsibility
  ----------------------------------- -----------------------------------
  `PrismaModule`                      Shared database access

  `AuthModule`                        Registration, login, JWT strategy,
                                      and authorization components

  `BooksModule`                       Book catalogue endpoints and
                                      business logic

  `GenresModule`                      Genre management endpoints and
                                      business logic
  -----------------------------------------------------------------------

## 5. Repository Structure

``` text
library-management-system/
│
├── .gitignore
├── README.md
│
├── docs/
│   └── postman_collection.json
│
└── api/
    ├── prisma/
    │   ├── migrations/
    │   │   ├── 20261113105220_init/
    │   │   │   └── migration.sql
    │   │   └── 20261120195053_add_user_password_hash/
    │   │       └── migration.sql
    │   ├── schema.prisma
    │   └── seed.ts
    │
    ├── src/
    │   ├── auth/
    │   │   ├── dto/
    │   │   │   ├── login.dto.ts
    │   │   │   └── register.dto.ts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.module.ts
    │   │   ├── auth.service.ts
    │   │   ├── jwt-auth.guard.ts
    │   │   ├── jwt.strategy.ts
    │   │   ├── roles.decorator.ts
    │   │   └── roles.guard.ts
    │   │
    │   ├── books/
    │   │   ├── dto/
    │   │   │   ├── create-book.dto.ts
    │   │   │   ├── get-books-query.dto.ts
    │   │   │   └── update-book.dto.ts
    │   │   ├── books.controller.ts
    │   │   ├── books.module.ts
    │   │   └── books.service.ts
    │   │
    │   ├── genres/
    │   │   ├── dto/
    │   │   │   ├── create-genre.dto.ts
    │   │   │   └── update-genre.dto.ts
    │   │   ├── genres.controller.ts
    │   │   ├── genres.module.ts
    │   │   └── genres.service.ts
    │   │
    │   ├── prisma/
    │   │   ├── prisma.module.ts
    │   │   └── prisma.service.ts
    │   │
    │   ├── app.module.ts
    │   └── main.ts
    │
    ├── test/
    ├── .env.example
    ├── package.json
    ├── package-lock.json
    └── prisma7.config.ts
```

Prisma Client is generated under `api/src/generated/prisma/`. Generated
output and installed dependencies are not committed.

## 6. Database Design

The current relational database contains three models and one enum:

-   `User`
-   `Genre`
-   `Book`
-   `Role`

### Entity relationship diagram

``` mermaid
erDiagram
    Genre ||--o{ Book : categorizes

    User {
        int id PK
        string name
        string email UK
        string passwordHash
        Role role
        datetime createdAt
        datetime updatedAt
    }

    Genre {
        int id PK
        string name UK
        string slug UK
        datetime createdAt
        datetime updatedAt
    }

    Book {
        int id PK
        string title
        string author
        string isbn UK
        int totalCopies
        int availableCopies
        int genreId FK
        datetime createdAt
        datetime updatedAt
    }
```

### User model

  -----------------------------------------------------------------------
  Field                   Type                    Description
  ----------------------- ----------------------- -----------------------
  `id`                    `Int`                   Auto-incrementing
                                                  primary key

  `name`                  `String`                User's name

  `email`                 `String`                Unique email address

  `passwordHash`          `String?`               Bcrypt password hash;
                                                  nullable in current
                                                  schema

  `role`                  `Role`                  User role; defaults to
                                                  `PATRON`

  `createdAt`             `DateTime`              Creation timestamp

  `updatedAt`             `DateTime`              Last update timestamp
  -----------------------------------------------------------------------

`passwordHash` is nullable to accommodate existing records during the
schema migration. The registration flow stores a hash for newly
registered patrons.

### Genre model

  Field         Type         Description
  ------------- ------------ --------------------------------
  `id`          `Int`        Auto-incrementing primary key
  `name`        `String`     Unique genre name
  `slug`        `String`     Unique URL-friendly identifier
  `books`       `Book[]`     Related books
  `createdAt`   `DateTime`   Creation timestamp
  `updatedAt`   `DateTime`   Last update timestamp

### Book model

  Field               Type         Description
  ------------------- ------------ -------------------------------
  `id`                `Int`        Auto-incrementing primary key
  `title`             `String`     Book title
  `author`            `String`     Author
  `isbn`              `String`     Unique ISBN
  `totalCopies`       `Int`        Total copies owned
  `availableCopies`   `Int`        Copies recorded as available
  `genreId`           `Int`        Foreign key to `Genre`
  `genre`             `Genre`      Related genre
  `createdAt`         `DateTime`   Creation timestamp
  `updatedAt`         `DateTime`   Last update timestamp

### Role enum

``` prisma
enum Role {
  PATRON
  LIBRARIAN
}
```

New users default to `PATRON`. The seed script creates or updates the
configured librarian account with the `LIBRARIAN` role.

### Relationships and constraints

A genre can contain many books, while each book belongs to one required
genre:

``` text
Genre (1) ──────────── (Many) Book
```

`Book.genreId` references `Genre.id`. The `User` model is currently
independent; borrowing records and user-to-book relationships have not
yet been implemented.

  -----------------------------------------------------------------------
  Constraint                          Purpose
  ----------------------------------- -----------------------------------
  Primary keys                        Uniquely identify records

  Unique user email                   Prevents duplicate accounts

  Unique genre name and slug          Prevents duplicate genre
                                      identifiers

  Unique book ISBN                    Prevents duplicate ISBNs

  Book-to-Genre foreign key           Ensures each book references an
                                      existing genre

  `@@index([genreId])`                Supports genre filtering

  `onDelete: Restrict`                Prevents deleting a genre that
                                      still has books

  `onUpdate: Cascade`                 Propagates changes to the
                                      referenced genre identifier

  Default role                        Assigns `PATRON` when no role is
                                      supplied
  -----------------------------------------------------------------------

## 7. Getting Started

### Prerequisites

  Tool           Requirement
  -------------- -------------------------------------------
  Node.js        24.x recommended; developed with v24.22.2
  npm            11.x used during development
  Git            Required to clone the repository
  Neon account   Hosted PostgreSQL database
  Postman        Recommended for API testing

### 1. Clone the repository

``` bash
git clone https://github.com/llavvy-design/library-management-system.git
```

### 2. Open the project

``` bash
cd library-management-system
```

### 3. Enter the API directory

``` bash
cd api
```

### 4. Install dependencies

``` powershell
npm.cmd install
```

On Windows PowerShell, `npm.cmd` and `npx.cmd` can be used if the
execution policy blocks the `.ps1` wrappers.

### 5. Create the local environment file

Run from `api/`:

``` powershell
Copy-Item .env.example .env
```

Configure the new `api/.env` file as described in the next section.

### 6. Generate Prisma Client

``` powershell
npx.cmd prisma generate
```

## 8. Environment Configuration

The API reads local environment variables from `api/.env`. Do not commit
this file or share its secrets.

### Required variables

  -----------------------------------------------------------------------
  Variable                            Purpose
  ----------------------------------- -----------------------------------
  `DATABASE_URL`                      Pooled Neon connection used by the
                                      running NestJS application

  `DATABASE_URL_UNPOOLED`             Direct Neon connection used by
                                      Prisma CLI operations

  `JWT_SECRET`                        Secret used to sign and verify JWTs

  `LIBRARIAN_NAME`                    Name for the seeded librarian

  `LIBRARIAN_EMAIL`                   Email for the seeded librarian

  `LIBRARIAN_PASSWORD`                Initial password for the seeded
                                      librarian
  -----------------------------------------------------------------------

### Example `.env` structure

Replace every placeholder with values from your own environment:

``` dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"

JWT_SECRET="replace-with-a-long-random-secret"

LIBRARIAN_NAME="Library Administrator"
LIBRARIAN_EMAIL="librarian@example.com"
LIBRARIAN_PASSWORD="replace-with-a-strong-password"
```

These are examples, not working credentials.

### Connection strings

-   `DATABASE_URL` should use the Neon pooled connection endpoint.
-   `DATABASE_URL_UNPOOLED` should use the direct connection endpoint.
-   The pooled hostname commonly contains `-pooler`.
-   The NestJS Prisma service reads the pooled URL.
-   Prisma CLI operations use the direct URL configured in
    `prisma7.config.ts`.

### Librarian account

The seed script reads the librarian name, email, and password from
environment variables. It normalizes the email and hashes the password
with bcrypt before storing it. Use those configured credentials to log
in as a librarian. Never place real credentials in this README, Git
commits, screenshots, or public messages.

## 9. Database Setup

Prisma configuration is stored in `api/prisma7.config.ts`; the schema is
in `api/prisma/schema.prisma`.

Run these commands from the `api/` directory.

### Validate the schema

``` powershell
npx.cmd prisma validate
```

### Apply committed migrations

``` powershell
npx.cmd prisma migrate deploy
```

This applies the migration files in `api/prisma/migrations/` to the
configured database.

### Generate Prisma Client

``` powershell
npx.cmd prisma generate
```

### Seed the database

``` powershell
npx.cmd prisma db seed
```

The seed script processes five genres, 21 catalogue books, and the
environment-configured librarian account. Genre and book records use
Prisma `upsert()` operations so repeated runs do not create duplicate
seeded records. The librarian record is created or updated from the
configured environment values.

### Check migration status

``` powershell
npx.cmd prisma migrate status
```

### Create a development migration

After changing `prisma/schema.prisma`:

``` powershell
npx.cmd prisma migrate dev --name descriptive_migration_name
```

Commit the generated migration directory with the corresponding schema
changes.

> Run migrations and seed commands only against the database environment
> you intend to modify. Development work uses the configured Neon
> development branch.

## 10. Running the API

Run commands from the `api/` directory. Ensure the environment variables
are configured and the database is accessible.

### Development mode

``` powershell
npm.cmd run start:dev
```

The application runs in watch mode. The default local API address is:

``` text
http://localhost:3000
```

### Production build

``` powershell
npm.cmd run build
```

### Production mode

``` powershell
npm.cmd run start:prod
```

## 11. API Reference

All endpoints are relative to:

``` text
http://localhost:3000
```

### Endpoint summary

  ------------------------------------------------------------------------
  Method            Endpoint           Description       Access
  ----------------- ------------------ ----------------- -----------------
  `POST`            `/auth/register`   Register a patron Public

  `POST`            `/auth/login`      Log in and        Public
                                       receive a JWT     

  `GET`             `/books`           List, search,     Public
                                       filter, and       
                                       paginate books    

  `GET`             `/books/:id`       Retrieve a book   Public

  `POST`            `/books`           Create a book     Librarian

  `PATCH`           `/books/:id`       Update a book     Librarian

  `DELETE`          `/books/:id`       Delete a book     Librarian

  `GET`             `/genres`          List genres       Public

  `GET`             `/genres/:id`      Retrieve a genre  Public

  `POST`            `/genres`          Create a genre    Public in current
                                                         implementation

  `PATCH`           `/genres/:id`      Update a genre    Public in current
                                                         implementation

  `DELETE`          `/genres/:id`      Delete a genre    Public in current
                                                         implementation
  ------------------------------------------------------------------------

**Authorization note:** Book write operations are protected by JWT
authentication and the `LIBRARIAN` role. Genre routes are not currently
protected by these guards. Do not assume genre write operations require
librarian authentication.

### 11.1 Authentication

#### Register a patron

``` http
POST /auth/register
Content-Type: application/json
```

Example request:

``` json
{
  "name": "Alex Patron",
  "email": "alex@example.com",
  "password": "StrongPassword123"
}
```

A successful registration returns `201 Created` with safe user
information and an access token. The password hash is not returned.
Public registration creates a `PATRON` account; it does not allow the
client to select the `LIBRARIAN` role.

#### Log in

``` http
POST /auth/login
Content-Type: application/json
```

Example request:

``` json
{
  "email": "alex@example.com",
  "password": "StrongPassword123"
}
```

A successful login returns `200 OK` and a token response containing
`accessToken`, `tokenType` (`Bearer`), `expiresIn` (one hour), and safe
user information.

### 11.2 Books

#### List books

``` http
GET /books
```

Query parameters:

  Parameter   Description
  ----------- -------------------------------------------------
  `search`    Case-insensitive search across title and author
  `genreId`   Filter by genre ID
  `page`      Page number; at least 1
  `limit`     Page size; between 1 and 100

Examples:

``` http
GET /books
GET /books?page=1&limit=10
GET /books?search=Chinua
GET /books?genreId=1
GET /books?genreId=1&search=Chinua&page=1&limit=5
```

The response includes matching book records and pagination metadata.
Book results include related genre information. Search applies to title
and author, not every property of a book.

#### Retrieve a book

``` http
GET /books/1
```

#### Create a book

Requires a librarian bearer token.

``` http
POST /books
Authorization: Bearer <LIBRARIAN_ACCESS_TOKEN>
Content-Type: application/json
```

Example body:

``` json
{
  "title": "Example Library Book",
  "author": "A. Writer",
  "isbn": "9780000000000",
  "totalCopies": 3,
  "genreId": 1
}
```

On creation, `availableCopies` is initialized to `totalCopies`.

#### Update a book

Requires a librarian bearer token.

``` http
PATCH /books/1
Authorization: Bearer <LIBRARIAN_ACCESS_TOKEN>
Content-Type: application/json
```

Example body:

``` json
{
  "title": "Updated Library Book",
  "totalCopies": 5
}
```

Only supplied fields are updated. When `totalCopies` changes, the
current implementation synchronizes `availableCopies` to the new total.
This is the current catalogue behavior; a future borrowing workflow will
require more careful inventory transaction rules.

#### Delete a book

Requires a librarian bearer token.

``` http
DELETE /books/1
Authorization: Bearer <LIBRARIAN_ACCESS_TOKEN>
```

### 11.3 Genres

#### List genres

``` http
GET /genres
```

Genre responses include the number of associated books.

#### Retrieve a genre

``` http
GET /genres/1
```

#### Create a genre

``` http
POST /genres
Content-Type: application/json
```

Example body:

``` json
{
  "name": "Mystery",
  "slug": "mystery"
}
```

#### Update a genre

``` http
PATCH /genres/1
Content-Type: application/json
```

Example body:

``` json
{
  "name": "Mystery and Crime"
}
```

#### Delete a genre

``` http
DELETE /genres/1
```

A genre cannot be deleted while books still reference it. The API
returns a conflict response in that situation.

## 12. Authentication and Authorization

The API uses JSON Web Tokens (JWT) and role-based access control.

### Registration and password storage

1.  A patron submits a name, email, and password.
2.  The registration DTO validates and normalizes the input.
3.  The password is hashed using bcrypt.
4.  The user is stored with the `PATRON` role.
5.  The response excludes the password hash.

The password validation flow enforces a minimum of 8 characters and a
maximum of 72 characters.

### Login

1.  The user submits an email and password.
2.  The service looks up the normalized email.
3.  bcrypt compares the submitted password with the stored hash.
4.  If valid, the service signs a JWT.
5.  The client sends the token in the `Authorization` header for
    protected routes.

### JWT header

``` http
Authorization: Bearer <ACCESS_TOKEN>
```

The JWT strategy verifies the token using `JWT_SECRET` and makes the
authenticated user's ID, email, and role available to the request.
Tokens expire after one hour in the current implementation; the user
must log in again to obtain a new token after expiry.

### Roles

-   `PATRON`: standard registered library user.
-   `LIBRARIAN`: user permitted to perform protected book write
    operations.

The `@Roles()` decorator declares the required role. `RolesGuard` checks
the authenticated user's role. Book creation, updating, and deletion use
both `JwtAuthGuard` and `RolesGuard`.

### Expected access outcomes

  -----------------------------------------------------------------------
  Request                             Expected result
  ----------------------------------- -----------------------------------
  Unauthenticated request to          `401 Unauthorized`
  protected book write route          

  Patron token on librarian-only book `403 Forbidden`
  write route                         

  Valid librarian token on protected  Authorized
  book write route                    

  Public book or genre read request   No JWT required
  -----------------------------------------------------------------------

## 13. Postman Collection

An importable collection is included at:

``` text
docs/postman_collection.json
```

It contains requests for authentication and the book and genre
endpoints.

### Collection variables

  -----------------------------------------------------------------------
  Variable                            Purpose
  ----------------------------------- -----------------------------------
  `baseUrl`                           API base URL; defaults to
                                      `http://localhost:3000`

  `accessToken`                       JWT saved by the authentication
                                      request scripts

  `currentRole`                       Role associated with the most
                                      recently authenticated user
  -----------------------------------------------------------------------

The login and registration scripts save the returned token for use by
protected book write requests.

### Import instructions

1.  Start the API.
2.  Open Postman and select **Import**.
3.  Select `docs/postman_collection.json`.
4.  Open the **Library Management System API** collection.
5.  Confirm `baseUrl` points to your running API.
6.  Register or log in to obtain a token.
7.  Use the librarian credentials configured in your local environment
    to test protected book write operations.

The collection documents current API behavior. Genre write routes are
public in the current implementation.

## 14. Validation and Error Handling

The application configures a global NestJS `ValidationPipe` with
transformation and whitelisting enabled. Request DTOs validate incoming
data, and properties not declared in the DTO are not accepted as
ordinary validated input.

Validation is applied to book and genre create/update requests,
authentication requests, and book query parameters.

### Common HTTP outcomes

  Condition                                         Typical status
  ------------------------------------------- --------------------
  Successful resource creation                       `201 Created`
  Successful retrieval or update                          `200 OK`
  Invalid DTO input                              `400 Bad Request`
  Missing resource                                 `404 Not Found`
  Invalid login credentials                     `401 Unauthorized`
  Missing or invalid JWT on protected route     `401 Unauthorized`
  Insufficient role                                `403 Forbidden`
  Duplicate unique value                            `409 Conflict`
  Deleting a genre that still has books             `409 Conflict`

The exact response body is generated by the relevant NestJS exception
handling.

## 15. Testing and Verification

The implementation has been built and manually exercised against the
development database and local API.

### Build and dependency audit

Run from `api/`:

``` powershell
npm.cmd run build
npm.cmd audit
```

At the latest Session 2 verification: - `npm.cmd run build` completed
successfully. - `npm.cmd audit` reported **0 vulnerabilities**.

Audit results describe the dependency state at the time they were run.
Re-run the audit after dependency changes.

### Manually verified API behavior

-   Listing genres and checking book counts.
-   Creating, retrieving, updating, and deleting genres.
-   Handling duplicate genre values.
-   Rejecting deletion of a genre that still contains books.
-   Listing books and checking pagination.
-   Searching by title/author and filtering by genre.
-   Combining search, genre filtering, and pagination.
-   Creating, retrieving, updating, and deleting books.
-   Initializing and synchronizing book copy counts.
-   Rejecting duplicate ISBN values and invalid inventory input.
-   Registering a patron and logging in.
-   Confirming password hashes are not returned.
-   Rejecting book write requests without a token.
-   Rejecting patron access to librarian-only book write routes.
-   Accepting librarian access to protected book write routes.

### Useful verification commands

``` powershell
npx.cmd prisma validate
npx.cmd prisma migrate status
npm.cmd run build
npm.cmd audit
```

The repository contains NestJS test files. Automated test coverage
should be evaluated separately; the manual API verification above is not
a claim that every automated test suite has been run.

## 16. Security Notes

-   Store database connection strings and JWT secrets in `api/.env`.
-   Never commit `.env` files or expose their values.
-   Use `.env.example` as a template, not for real credentials.
-   Use a strong, private `JWT_SECRET`.
-   Passwords are stored as bcrypt hashes, not plaintext.
-   Public registration creates patrons; it does not provide a public
    way to assign the librarian role.
-   Use the environment-configured librarian account for privileged book
    operations.
-   Keep dependencies updated and review `npm audit` results.
-   Use the intended Neon development database when running development
    migrations and seed commands.
-   Do not expose production credentials in Postman screenshots or
    shared collections.

A temporary npm dependency override for `effect` was added to address a
reported transitive dependency vulnerability in the installed Prisma
dependency tree. Review this override when a compatible upstream
dependency update makes it unnecessary.

## 17. Current Implementation Status

  Area                                    Status
  --------------------------------------- ---------------------
  NestJS application foundation           Complete
  Prisma 7 and Neon integration           Complete
  Prisma schema and migrations            Complete
  Genre CRUD API                          Complete
  Book CRUD API                           Complete
  Book search by title and author         Complete
  Genre filtering                         Complete
  Book pagination                         Complete
  Book and genre DTO validation           Complete
  Global validation and CORS              Complete
  Patron registration and login           Complete
  bcrypt password hashing                 Complete
  JWT strategy and authentication guard   Complete
  Roles decorator and RolesGuard          Complete
  Librarian-only book write operations    Complete
  Environment-based librarian seeding     Complete
  Postman collection                      Complete
  Build verification                      Passed
  npm audit at latest verification        0 vulnerabilities
  Borrowing and returns workflow          Not yet implemented
  Frontend application                    Not yet implemented

### Assignment scope completed

The current backend covers the catalogue and security requirements: -
Genre CRUD. - Book CRUD. - Search, filtering, and pagination. - DTO
validation. - Patron registration and login. - bcrypt password
hashing. - JWT authentication. - Librarian role authorization for book
create/update/delete. - Postman collection documenting the API
endpoints.

Optional profile and login rate-limiting features are not included in
the current implementation.

## 18. Planned Development

The following are future development items, not completed features.

### Borrowing and returns

-   Create borrowing records.
-   Associate a borrowing record with a patron and a book.
-   Track borrowing dates and due dates.
-   Process book returns.
-   Update inventory safely when books are borrowed and returned.
-   Prevent borrowing when no copies are available.
-   Identify overdue loans.

### User features

-   User profile endpoint.
-   Account management.
-   Additional account and permission workflows.

### Frontend

-   Build a responsive interface for patrons and librarians.
-   Display and search the book catalogue.
-   Provide librarian management screens.
-   Provide patron borrowing views after the borrowing module exists.

### Further engineering improvements

-   Add automated integration and end-to-end tests.
-   Add API documentation, such as an OpenAPI/Swagger specification.
-   Consider login rate limiting.
-   Add structured logging and production monitoring.
-   Review inventory update rules when transactional borrowing workflows
    are introduced.

## 19. Design Decisions

### Why use a relational database?

A library catalogue contains structured entities with clear
relationships. PostgreSQL provides primary keys, unique constraints,
foreign keys, and transactions that help preserve data integrity.

### Why separate Genre and Book?

A genre can classify many books. Storing the genre once and referencing
it through `genreId` avoids repeating genre names in every book record.

### Why use a Role enum?

The `Role` enum restricts role values to `PATRON` and `LIBRARIAN`,
giving the application a consistent basis for role checks.

### Why use Prisma?

Prisma provides schema-based data modelling, generated TypeScript types,
migration tooling, and a structured way for NestJS services to access
PostgreSQL.

### Why use a Neon driver adapter?

The PrismaNeon adapter connects Prisma Client to the hosted Neon
PostgreSQL database. The application uses the pooled connection for
runtime database access, while Prisma CLI operations use the direct
connection configured for migrations.

### Why separate controllers and services?

Controllers focus on HTTP concerns, while services contain application
logic and database operations. This separation makes features easier to
maintain and test.

### Why hash passwords?

Passwords should not be stored as plaintext. The authentication service
uses bcrypt to store password hashes and compare submitted passwords
during login.

### Why protect book write operations?

Creating, updating, and deleting catalogue records are librarian
responsibilities in the current authorization model. JWT authentication
establishes the caller's identity, and the RolesGuard checks whether the
caller has the required role.

## 20. Learning Resources

-   [NestJS Documentation](https://docs.nestjs.com/)
-   [NestJS Modules](https://docs.nestjs.com/modules)
-   [NestJS Controllers](https://docs.nestjs.com/controllers)
-   [NestJS Providers](https://docs.nestjs.com/providers)
-   [NestJS
    Authentication](https://docs.nestjs.com/security/authentication)
-   [Prisma Documentation](https://www.prisma.io/docs)
-   [Prisma Schema
    Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)
-   [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
-   [Prisma
    Seeding](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)
-   [PostgreSQL Documentation](https://www.postgresql.org/docs/)
-   [Neon Documentation](https://neon.com/docs)
-   [Node.js Documentation](https://nodejs.org/docs/)
-   [TypeScript Documentation](https://www.typescriptlang.org/docs/)
-   [Postman Learning Center](https://learning.postman.com/)

## 21. Author and Repository

**Author:** Lavine Lornah

**Repository:**
[library-management-system](https://github.com/llavvy-design/library-management-system)

**Project focus:** Full Stack Software Engineering, backend development,
REST API design, relational database modelling, authentication and
authorization.

**Development approach:** Incremental implementation, modular
architecture, documented design decisions, version-controlled database
migrations, reproducible database seeding, and manual API verification.

------------------------------------------------------------------------
