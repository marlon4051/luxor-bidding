# Project Configuration

This document provides instructions to set up and run the project in a local environment.

## Prerequisites

Make sure you have the following installed before proceeding:

- **Node.js** (recommended version: latest)
- **npm** (recommended version: latest)
- **PostgreSQL** (recommended version: latest)

## Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/marlon4051/luxor-bidding.git
cd luxor-bidding
```

To install dependencies:

```sh
npm install
```

## Environment Configuration

Copy the environment variables file:

```sh
cp .env.example .env
```

Edit `.env` with the correct values:

```ini
DATABASE_URL=postgresql://user:password@localhost:5432/luxor_bidding
JWT_SECRET=your-secret-key
```

## Database Setup

Create the database before running migrations:

```sh
createdb -U postgres luxor_bidding
```

Run Prisma migrations to create tables in PostgreSQL:

```sh
npx prisma migrate dev --name init
```

To insert test data, run:

```sh
npx prisma db seed
```

If you want to inspect the database with Prisma Studio:

```sh
npx prisma studio
```

## Running the Project

To start the development server:

```sh
npm run dev
```

---

## Application Monitoring

To ensure the application runs smoothly, consider using:
- **Structured logging** with tools like Winston or Pino.
- **Error monitoring** with tools like Sentry or Bugsnag.
- **Metrics monitoring** with Prometheus and Grafana.
- **Database monitoring** with PgAdmin.
- **Security scanning** using Snyk.

## Scalability and Performance

To improve the scalability and performance of the application:
- **Caching** with Redis to reduce database load.
- **Load balancing** using Nginx or a cloud service like AWS ALB.
- **Optimized queries** in Prisma and PostgreSQL.
- **Containerized deployment** using Kubernetes or Docker in production.

## Trade-offs and Decisions

While developing this project, the following decisions were made considering time and resource constraints:
- **Prisma as ORM**, which simplifies database management but may be less efficient than raw SQL queries in some cases.
- **JWT authentication**, quick to implement but could be enhanced with OAuth for better security.
- **Using an initial seed**, which facilitates application testing but does not cover all possible real-world data scenarios.
- **Using ShadCN for UI components**, which allowed for faster development, but custom designs would have been preferred with more time.

With more time and resources, potential improvements could include:
- **Implementing automated tests** including unit, integration, and E2E tests.
- **Further optimizing queries and index management in PostgreSQL.**
- **Separating the backend into a standalone Node.js service for better scalability and maintainability.**
- **Implement user registration.**

---

Your project is now ready to run locally. 🚀

