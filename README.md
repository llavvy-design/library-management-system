# Library Management System

A database-driven Library Management System backend built with NestJS, TypeScript, Prisma ORM 7 and PostgreSQL hosted on Neon.

The project establishes a modular backend foundation and a relational database for managing library books, genres, users and book inventory.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Project Objectives](#2-project-objectives)
- [3. Technology Stack](#3-technology-stack)
- [4. System Architecture](#4-system-architecture)
- [5. Project Structure](#5-project-structure)
- [6. Database Design](#6-database-design)
- [7. Schema Decisions](#7-schema-decisions)
- [8. Entity Relationship Diagram](#8-entity-relationship-diagram)
- [9. Data Models](#9-data-models)
- [10. Database Constraints and Integrity](#10-database-constraints-and-integrity)
- [11. Getting Started](#11-getting-started)
- [12. Environment Configuration](#12-environment-configuration)
- [13. Prisma Configuration](#13-prisma-configuration)
- [14. Database Migrations](#14-database-migrations)
- [15. Database Seeding](#15-database-seeding)
- [16. Running the Application](#16-running-the-application)
- [17. Verification and Testing](#17-verification-and-testing)
- [18. Security Considerations](#18-security-considerations)
- [19. Current Implementation Status](#19-current-implementation-status)
- [20. Future Development](#20-future-development)
- [21. Learning Resources](#21-learning-resources)

---

## 1. Project Overview

The Library Management System is a backend engineering project developed as part of a Full Stack Engineering specialization.

The application is designed to provide a structured foundation for managing library catalogues and related information through a relational database.

The current implementation focuses on establishing a reliable backend environment, designing the library database schema, configuring database connectivity and populating the database with initial catalogue records.

The project uses NestJS as its backend framework, Prisma ORM as its database toolkit and Neon as its hosted PostgreSQL database provider.

The initial data layer supports three primary entities:

- **Book:** Represents individual books within the library catalogue.
- **Genre:** Categorizes books according to their literary classification.
- **User:** Represents individuals who interact with the library system.

User roles are controlled through a PostgreSQL enum containing `PATRON` and `LIBRARIAN`.

### Project Information

| Attribute | Details |
|---|---|
| Project Name | Library Management System |
| Repository | library-management-system |
| Application Type | Backend REST API |
| Backend Framework | NestJS |
| Programming Language | TypeScript |
| ORM | Prisma ORM 7 |
| Database | PostgreSQL |
| Database Hosting | Neon |
| Database Development Branch | development |
| Database Name | neondb |
| Architecture | Modular backend architecture |
| Initial Data | 5 genres and 21 books |
| Development Status | Database foundation implemented |

---

## 2. Project Objectives

The main objectives of this project are to:

1. Establish a NestJS backend application using TypeScript.
2. Understand how NestJS extends Node.js application development through its modular architecture and dependency injection system.
3. Provision and connect a hosted PostgreSQL database.
4. Integrate Prisma ORM with NestJS using a PostgreSQL-compatible driver adapter.
5. Design relational database models for books, genres and users.
6. Implement a Role enum containing PATRON and LIBRARIAN.
7. Establish a one-to-many relationship between Genre and Book.
8. Apply database schema changes using Prisma Migrate.
9. Populate the database with an initial library catalogue.
10. Document database architecture, relationships and schema decisions.
11. Establish a maintainable foundation for subsequent CRUD functionality.

---

## 3. Technology Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| TypeScript | Statically typed application development |
| NestJS | Modular Node.js backend framework |
| NestJS CLI | Application scaffolding and code generation |
| Express | HTTP platform used by NestJS |

### Database and Data Access

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database management system |
| Neon | Hosted serverless PostgreSQL platform |
| Prisma ORM 7 | Database schema modelling and data access |
| Prisma Client | Generated type-safe database client |
| PrismaNeon | Driver adapter connecting Prisma Client to Neon |
| Prisma Migrate | Database schema migration management |
| Prisma Studio | Graphical database exploration tool |

### Development Tools

| Tool | Purpose |
|---|---|
| Visual Studio Code | Source code editing |
| Git | Version control |
| GitHub | Source code hosting |
| npm | Package management |
| tsx | Execution of TypeScript scripts |
| dotenv | Environment variable loading |
| Vitest | Application testing |
| Oxlint | Static code analysis |
| Prettier | Code formatting |

---

## 4. System Architecture

The project follows a modular backend architecture.

NestJS organizes application functionality into modules, controllers and providers.

The database layer is separated from HTTP request handling to improve maintainability and reusability.

### Database Interaction Flow

```mermaid
flowchart TD
    A[HTTP Client] --> B[NestJS Application]
    B --> C[Controller]
    C --> D[Application Service]
    D --> E[PrismaService]
    E --> F[Prisma Client]
    F --> G[PrismaNeon Driver Adapter]
    G --> H[Neon PostgreSQL]
```

### Architecture Components

**NestJS Application**

The main application environment responsible for handling HTTP requests and coordinating application modules.

**Controllers**

Controllers define application routes and handle incoming HTTP requests.

**Services**

Services contain application logic and coordinate operations between controllers and the database layer.

**PrismaService**

PrismaService extends the generated PrismaClient and provides reusable database access through NestJS Dependency Injection.

**PrismaModule**

Registers and exports PrismaService so that other application modules can access database functionality.

**Prisma Client**

Provides generated, type-safe database operations based on the Prisma schema.

**PrismaNeon Adapter**

Connects Prisma Client to the Neon PostgreSQL database using the Neon serverless driver.

---

## 5. Project Structure

The repository is organized into a root project directory and an API application directory.

```text
library-management-system/
│
├── .gitignore
├── README.md
│
└── api/
    │
    ├── prisma/
    │   ├── migrations/
    │   │   └── 20261113105220_init/
    │   │       └── migration.sql
    │   │
    │   ├── schema.prisma
    │   └── seed.ts
    │
    ├── src/
    │   │
    │   ├── generated/
    │   │   └── prisma/
    │   │
    │   ├── prisma/
    │   │   ├── prisma.module.ts
    │   │   └── prisma.service.ts
    │   │
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   ├── app.service.ts
    │   └── main.ts
    │
    ├── test/
    │
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    └── prisma7.config.ts
```

### Important Directories and Files

| Path | Responsibility |
|---|---|
| `api/src/` | Main NestJS application source code |
| `api/src/prisma/` | Prisma service and module integration |
| `api/src/generated/prisma/` | Generated Prisma Client |
| `api/prisma/` | Database schema, migrations and seed script |
| `api/prisma/migrations/` | Version-controlled database migration history |
| `api/prisma/schema.prisma` | Database models, fields and relationships |
| `api/prisma/seed.ts` | Initial library catalogue population |
| `api/prisma7.config.ts` | Prisma CLI and migration configuration |
| `api/.env` | Local database connection credentials |
| `api/.env.example` | Environment configuration template |
| `api/src/main.ts` | NestJS application entry point |
| `api/src/app.module.ts` | Root application module |

The `generated/prisma` directory is generated from the Prisma schema and is excluded from Git version control.

---

## 6. Database Design

The database uses PostgreSQL as its relational database management system.

The initial schema consists of three principal models:

1. User
2. Genre
3. Book

It also contains a PostgreSQL enum named Role.

### Database Overview

| Model | Responsibility |
|---|---|
| User | Stores library user information and roles |
| Genre | Stores book classification categories |
| Book | Stores book catalogue and inventory information |
| Role | Defines permitted user role values |

### Database Relationships

The database implements a one-to-many relationship between Genre and Book.

A genre can contain multiple books, while each book belongs to exactly one genre.

A User record is independent in the current schema and does not yet have a foreign key relationship with another model.

---

## 7. Schema Decisions

### Why does Book reference Genre instead of embedding it?

The Book model references the Genre model through a foreign key named `genreId` rather than storing genre information directly inside every Book record.

This is a deliberate relational database design decision.

A library can contain many books belonging to the same genre. Storing the genre name separately inside every book would introduce unnecessary data duplication.

For example, consider a library containing three books in the Fantasy genre.

An embedded approach could store:

| Book | Genre |
|---|---|
| A Game of Thrones | Fantasy |
| The Name of the Wind | Fantasy |
| The Golden Compass | Fantasy |

The genre name would be repeated in every book record.

Our relational design instead stores the genre once in the Genre table and uses its primary key to associate books with it.

### Advantages of this design

**1. Reduced data duplication**

A genre name is stored once and referenced by multiple books.

If the genre name changes, the change is made in one record rather than across every associated book.

**2. Referential integrity**

The foreign key ensures that a book cannot reference a genre that does not exist.

PostgreSQL enforces this relationship at the database level.

**3. Easier maintenance**

Genre information can be created, updated and retrieved independently of the books associated with it.

**4. Flexible querying**

The relationship allows the application to retrieve individual books, all books belonging to a genre or genre information alongside book details.

**5. Database normalization**

Separating genres from books reduces repeated information and supports a more maintainable relational structure.

### Why is the relationship one-to-many?

The relationship is represented as:

`Genre (1) → Book (Many)`

One genre may have several books, but each book has one required genre.

In Prisma, the relationship is defined using:

```prisma
model Genre {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  books Book[]
}

model Book {
  id      Int    @id @default(autoincrement())
  title   String
  genreId Int
  genre   Genre  @relation(fields: [genreId], references: [id])
}
```

The `genreId` field is the actual foreign key column.

The `books` and `genre` fields define the Prisma relationship and provide convenient navigation between related records.

### Why use a Role enum?

The Role enum restricts user roles to a predefined set of permitted values.

The current values are:

- `PATRON`
- `LIBRARIAN`

This prevents arbitrary role values from being inserted into the database.

### Why use unique constraints?

Unique constraints prevent duplicate values in fields that identify records.

The schema enforces uniqueness for:

- User email addresses.
- Genre names.
- Genre slugs.
- Book ISBNs.

These constraints are enforced by PostgreSQL rather than relying solely on application-level validation.

---

## 8. Entity Relationship Diagram

The following diagram represents the current database structure.

```mermaid
erDiagram
    Genre ||--o{ Book : categorizes

    User {
        int id PK
        string name
        string email UK
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

### Relationship Explanation

| Relationship | Type | Description |
|---|---|---|
| Genre to Book | One-to-many | One genre can contain multiple books |
| Book to Genre | Many-to-one | Each book references one genre |
| Role to User | Enum assignment | Each user has one permitted role |

The current schema uses `onDelete: Restrict` for the Book-to-Genre relationship.

This prevents deletion of a genre while books still reference it.

The relationship uses `onUpdate: Cascade` so that changes to the referenced genre identifier propagate to associated books.

---

## 9. Data Models

### 9.1 User Model

The User model represents individuals who interact with the library.

| Field | Type | Description |
|---|---|---|
| id | Int | Primary key |
| name | String | User's name |
| email | String | Unique email address |
| role | Role | User role |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last modification timestamp |

The role field defaults to `PATRON`.

The schema provides the foundation for distinguishing patrons from librarians.

Authentication and password management are not yet implemented.

### 9.2 Genre Model

The Genre model stores the categories used to classify library books.

| Field | Type | Description |
|---|---|---|
| id | Int | Primary key |
| name | String | Unique genre name |
| slug | String | Unique URL-friendly identifier |
| books | Book[] | Related books |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last modification timestamp |

The `books` field represents the collection of books associated with a genre.

### 9.3 Book Model

The Book model stores information about books available in the library catalogue.

| Field | Type | Description |
|---|---|---|
| id | Int | Primary key |
| title | String | Book title |
| author | String | Book author |
| isbn | String | Unique ISBN |
| totalCopies | Int | Total number of copies |
| availableCopies | Int | Number of available copies |
| genreId | Int | Foreign key referencing Genre |
| genre | Genre | Related genre |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last modification timestamp |

The inventory fields default to one copy when a record is created without explicitly provided quantities.

---

## 10. Database Constraints and Integrity

The database uses several constraints to preserve data consistency.

| Constraint | Implementation | Purpose |
|---|---|---|
| Primary Key | `@id` | Uniquely identifies each record |
| Auto Increment | `@default(autoincrement())` | Generates numeric identifiers |
| Unique Email | `@unique` | Prevents duplicate user emails |
| Unique Genre Name | `@unique` | Prevents duplicate genre names |
| Unique Genre Slug | `@unique` | Prevents duplicate genre slugs |
| Unique ISBN | `@unique` | Prevents duplicate book ISBNs |
| Foreign Key | `@relation` | Enforces the Book–Genre relationship |
| Index | `@@index([genreId])` | Supports queries filtering by genre |
| Default Role | `@default(PATRON)` | Provides a default user role |
| Default Timestamp | `@default(now())` | Records creation time |
| Updated Timestamp | `@updatedAt` | Tracks record modifications |

The Book model also uses a database index on `genreId`.

Application-level validation will be responsible for enforcing inventory rules such as preventing available copies from exceeding total copies.

---

## 11. Getting Started

### Prerequisites

Before running the application, ensure that the following tools are installed:

| Tool | Requirement |
|---|---|
| Node.js | Node.js 24.x |
| npm | Compatible npm version |
| Git | Installed and configured |
| Visual Studio Code | Recommended code editor |
| Neon account | Hosted PostgreSQL database |

The project uses Node.js v24.22.2 and npm 11 during development.

### Step 1: Clone the repository

```bash
git clone https://github.com/llavvy-design/library-management-system.git
```

Navigate into the repository:

```bash
cd library-management-system
```

### Step 2: Enter the API directory

```bash
cd api
```

### Step 3: Install dependencies

```bash
npm install
```

This installs the dependencies defined in `package.json` and `package-lock.json`.

### Step 4: Create the environment file

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open the new `.env` file and configure the PostgreSQL connection strings.

### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

This generates the TypeScript database client using the models defined in `prisma/schema.prisma`.


**On Windows PowerShell, use `npm.cmd` and `npx.cmd` instead of `npm` and `npx` when the local execution policy prevents PowerShell from running the `npm .ps1` wrappers**

---

## 12. Environment Configuration

The application requires environment variables to connect to the hosted PostgreSQL database.

The environment variables are stored locally in:

`api/.env`

### Required Variables

| Variable | Purpose |
|---|---|
| DATABASE_URL | Pooled Neon PostgreSQL connection |
| DATABASE_URL_UNPOOLED | Direct Neon PostgreSQL connection |

### Example Configuration

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
```

These values are placeholders.

Replace them with the connection strings generated by your Neon project.

### Connection Types

**Pooled Connection**

`DATABASE_URL` uses the Neon pooled connection endpoint.

It is used by the NestJS application through the PrismaNeon driver adapter.

The pooled hostname normally contains `-pooler`.

**Direct Connection**

`DATABASE_URL_UNPOOLED` uses the direct PostgreSQL connection endpoint.

It is used by Prisma CLI operations such as development migrations.

The direct hostname does not contain `-pooler`.

### Security

Actual credentials must never be committed to version control.

The `.env` file is excluded through Git ignore rules.

The `.env.example` file is included in the repository to document the required environment variables without exposing credentials.

---

## 13. Prisma Configuration

Prisma configuration is maintained in:

`api/prisma7.config.ts`

The configuration defines:

- Prisma schema location.
- Migration directory.
- Seed command.
- Direct PostgreSQL connection URL.

The Prisma schema is located at:

`api/prisma/schema.prisma`

### Prisma Client Generator

The project uses the `prisma-client` generator with an explicitly configured output directory.

The generated client is stored in:

`api/src/generated/prisma`

The application imports PrismaClient from this generated location.

The Neon driver adapter is configured when Prisma Client is instantiated.

### PrismaService

The PrismaService is located at:

`api/src/prisma/prisma.service.ts`

It extends the generated PrismaClient and implements the NestJS lifecycle interfaces.

The service:

- Configures PrismaNeon.
- Reads the pooled database connection from environment variables.
- Establishes the database connection during module initialization.
- Disconnects during application shutdown.

### PrismaModule

The PrismaModule is located at:

`api/src/prisma/prisma.module.ts`

It registers PrismaService as a provider and exports it for use by other NestJS modules.

The root AppModule imports PrismaModule.


**This project uses `prisma7.config.ts`, the Prisma configuration filename supported by Prisma 7.10 and later. The project retains this generated filename rather than introducing a second configuration file**

---

## 14. Database Migrations

Database migrations are managed through Prisma Migrate.

Migrations provide a version-controlled history of changes made to the database schema.

The initial migration is:

`20261113105220_init`

Location:

`api/prisma/migrations/20261113105220_init/migration.sql`

It creates:

- The Role enum.
- The User table.
- The Genre table.
- The Book table.
- Unique indexes.
- The Book-to-Genre foreign key.
- The genreId index.

### Validate the Schema

```bash
npx prisma validate
```

### Format the Schema

```bash
npx prisma format
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Check Migration Status

```bash
npx prisma migrate status
```

### Apply Existing Migrations to a New Database

```bash
npx prisma migrate deploy
```

This applies committed migration files to the configured database.

### Create a New Development Migration

When the Prisma schema is changed during development:

```bash
npx prisma migrate dev --name descriptive_migration_name
```

Migration files should be committed to Git so that other development environments can reproduce the database structure.

The Prisma CLI uses the direct connection configured through `DATABASE_URL_UNPOOLED`.

---

## 15. Database Seeding

Database seeding populates the database with initial records required for development and testing.

The seed implementation is located at:

`api/prisma/seed.ts`

The seed script uses Prisma Client and the Neon driver adapter.

### Seed Configuration

The seed command is registered in the `migrations` section of `prisma7.config.ts`.

The configured command is:

```text
tsx prisma/seed.ts
```

### Execute the Seed Script

```bash
npx prisma db seed
```

### Seed Dataset

The initial dataset contains five genres and 21 books.

| Genre | Number of Books |
|---|---:|
| African Literature | 5 |
| Contemporary Fiction | 4 |
| Fantasy | 4 |
| Science Fiction | 4 |
| Historical Fiction | 4 |
| **Total** | **21** |

### Seed Implementation Features

The seed script:

1. Establishes a Prisma database connection.
2. Creates or updates the five genre records.
3. Associates each book with its corresponding genre.
4. Inserts or updates the 21 book records.
5. Uses unique ISBNs to identify books.
6. Uses genre slugs to identify genres.
7. Disconnects Prisma Client when execution finishes.

### Idempotency

The seed script uses Prisma `upsert()` operations.

An upsert checks whether a record already exists using its unique identifier.

If the record exists, it is updated.

If it does not exist, a new record is created.

This allows the seed process to be executed repeatedly without creating duplicate seeded genres or books.

### Verify Seeded Records

Count the genres:

```sql
SELECT COUNT(*) AS total_genres
FROM "Genre";
```

Count the books:

```sql
SELECT COUNT(*) AS total_books
FROM "Book";
```

Inspect the genre distribution:

```sql
SELECT
    g.name AS genre,
    COUNT(b.id) AS total_books
FROM "Genre" g
LEFT JOIN "Book" b
    ON b."genreId" = g.id
GROUP BY g.id, g.name
ORDER BY g.name;
```

Expected results:

- Five genres.
- Twenty-one books.
- All books associated with their respective genres.

---

## 16. Running the Application

Ensure that the environment variables are configured and the database is accessible.

Navigate to the API directory:

```bash
cd api
```

### Development Mode

```bash
npm run start:dev
```

NestJS starts the application in watch mode.

Changes to application source files trigger recompilation.

The application listens on port 3000 by default.

The configured port can be overridden using the `PORT` environment variable.

### Production Build

```bash
npm run build
```

### Production Execution

```bash
npm run start:prod
```

### Application Endpoint

The initial NestJS application exposes a root GET route:

```text
GET /
```

This route currently returns the initial application response.

The book and catalogue CRUD endpoints are planned for subsequent development.

---

## 17. Verification and Testing

The following commands are available for project verification.

### Schema Validation

```bash
npx prisma validate
```

### Migration Status

```bash
npx prisma migrate status
```

### Database Seeding

```bash
npx prisma db seed
```

### Application Build

```bash
npm run build
```

### Unit Tests

```bash
npm run test
```

### Test Coverage

```bash
npm run test:cov
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Linting

```bash
npm run lint
```

### Security Audit

```bash
npm audit
```

A clean dependency audit should report zero known vulnerabilities.

---

## 18. Security Considerations

The project follows basic security practices for backend and database development.

### Environment Variables

- Database credentials are stored in `.env`.
- Actual credentials are excluded from Git.
- `.env.example` provides placeholder configuration.
- Credentials should not be exposed in screenshots, documentation or source code.

### Database Integrity

- Primary keys uniquely identify records.
- Unique constraints prevent duplicate identifiers.
- Foreign keys enforce valid relationships.
- Referential actions restrict deletion of genres that still contain books.

### Dependency Security

Dependencies are managed through npm.

The project uses `npm audit` to identify reported package vulnerabilities.

### Database Branching

Neon's development branch is separated from the parent production branch.

Development migrations and seed operations are performed against the development database.

### Connection Management

The application uses the Neon pooled connection through PrismaNeon, while Prisma CLI migration operations use the direct connection.

---

## 19. Current Implementation Status

The following functionality has been currently implemented.

| Component | Status |
|---|---|
| NestJS backend scaffold | Completed |
| TypeScript configuration | Completed |
| Neon PostgreSQL provisioning | Completed |
| Development database branch | Completed |
| Prisma ORM integration | Completed |
| Prisma Client generation | Completed |
| Role enum | Completed |
| User model | Completed |
| Genre model | Completed |
| Book model | Completed |
| Book–Genre relationship | Completed |
| Initial database migration | Completed |
| PrismaService | Completed |
| PrismaModule | Completed |
| Database lifecycle integration | Completed |
| Database seed configuration | Completed |
| Five genre records | Completed |
| Twenty-one book records | Completed |
| Seed repeat-execution test | Completed |
| Environment variable template | Completed |
| Project documentation | Completed |


Full catalogue CRUD operations, authentication and additional library management functionality remain part of subsequent development.

---

## 20. Future Development

The database foundation is designed to support additional library functionality.

Planned development areas include:

### Book Management

- Create new book records.
- Retrieve book details.
- Update book information.
- Delete book records where appropriate.
- Search and filter the catalogue.
- Retrieve books by genre.

### Genre Management

- Create and manage genres.
- Retrieve genres.
- Retrieve all books associated with a genre.

### User Management

- Implement user registration and management.
- Introduce authentication.
- Apply role-based access control for patrons and librarians.

### Library Inventory

- Track total and available copies.
- Implement borrowing and returning workflows.
- Prevent invalid inventory updates.

### Additional Functionality

- Introduce a Review model.
- Associate reviews with books and users.
- Implement pagination and sorting.
- Add API documentation.
- Introduce automated integration tests.

### Prisma vs. Document Database Modelling

One difference I noticed when modelling this library database is how relationships are represented.

With Prisma and PostgreSQL, I define separate models and explicitly establish relationships using foreign keys...For example, Book references Genre through genreId.

In a document database, related information can instead be embedded within a document thus reducing the need for separate lookups but may introduce data duplication.

For this library catalogue, separating Genre from Book provides better consistency and allows PostgreSQL to enforce referential integrity.

---

## 21. Learning Resources

The following official resources support the technologies used in this project:

### NestJS

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Modules](https://docs.nestjs.com/modules)
- [NestJS Providers](https://docs.nestjs.com/providers)
- [NestJS Lifecycle Events](https://docs.nestjs.com/fundamentals/lifecycle-events)

### Prisma

- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Prisma Seeding](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)
- [Prisma Driver Adapters](https://www.prisma.io/docs/orm/core-concepts/supported-databases/database-drivers)

### PostgreSQL and Neon

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Documentation](https://neon.com/docs)
- [Neon PostgreSQL Connections](https://neon.com/docs/connect/connect-from-any-app)

### Development Tools

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Documentation](https://docs.github.com/)

---

## Author and Repository

**Repository:** [library-management-system](https://github.com/llavvy-design/library-management-system)

**Project Focus:** Full Stack Engineering, Backend Development, Relational Database Design and ORM Integration.

**Development Approach:** Incremental implementation, documented architectural decisions, version-controlled migrations and reproducible database seeding.

**Author:** Lavine Lornah

