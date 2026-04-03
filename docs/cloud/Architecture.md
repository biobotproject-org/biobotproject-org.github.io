---
id: architecture
title: Architecture
sidebar_label: Architecture
sidebar_position: 4
---

# Architecture

## System Overview

BioBot Cloud is a Node.js/Express application backed by MySQL via the Sequelize ORM. It is one component in the larger BioBot wildfire detection system:

Field-deployed sensor nodes (BMV080 + BME688) transmit readings to this server over HTTPS via cellular uplink (Blues Notecard). The Express API ingests the readings, persists them to MySQL, and runs the alert engine. The React dashboard then queries the API to display live sensor data, deployment maps, and active alerts.

## Project Structure

### `server.js`

The entry point. Initializes Express, registers middleware (CORS, JSON body parsing, auth), mounts route handlers, and starts the HTTP listener. On startup it establishes a Sequelize database connection and syncs the schema.

### `config/`

Database configuration — constructs the Sequelize instance from environment variables. Centralizing this here means routes and models never hardcode connection details.

### `middleware/`

Custom Express middleware:

- **Auth middleware** — validates the `Authorization: Bearer <token>` header on protected routes, verifying the JWT signature against `JWT_SECRET`.
- **Error middleware** — catches unhandled errors and returns consistent JSON error responses.

### `models/`

Sequelize model definitions. Each model maps to a MySQL table:

| Model | Table | Description |
|---|---|---|
| `User` | `users` | Operator accounts |
| `Device` | `devices` | Registered sensor nodes |
| `Reading` | `readings` | Individual telemetry payloads |
| `Alert` | `alerts` | Triggered alert events |

Models define the schema and relationships (e.g. a `Reading` belongs to a `Device`). Sequelize handles query building and schema sync.

### `routes/`

Route handlers grouped by resource:

- `auth.js` — registration and login, issues JWTs
- `devices.js` — CRUD for sensor nodes
- `readings.js` — ingestion endpoint and query endpoint
- `alerts.js` — alert listing and acknowledgement

### `.env`

Environment configuration file. Contains database credentials, JWT secret, and server port. Should **never** be committed with real secrets.

---

## Data Flow: Sensor Reading

1. A field node collects air quality data (IAQ, PM, CO₂e, temperature, humidity) from BMV080/BME688 sensors.
2. The reading is transmitted over cellular (Blues Notecard) to `POST /api/readings`.
3. The readings route validates the payload and writes the record to the `readings` table.
4. The alert engine evaluates the new reading against configured thresholds.
5. If a threshold is exceeded, an alert record is written to the `alerts` table.
6. The dashboard polls `GET /api/alerts` and displays the alert to operators.

---

## Security Model

Authentication uses stateless JWT tokens. The server never stores session state — each request carries its own signed token. Tokens should be treated as secrets: they are scoped to authenticated operators and must be included with every protected request.

The `.env` file contains the signing key (`JWT_SECRET`). In production this should be a long, randomly generated string (at minimum 32 characters) and stored in a secrets manager rather than a flat file.

:::tip Rotate your JWT secret
If you suspect your `JWT_SECRET` has been exposed, rotate it immediately. All existing tokens will be invalidated, requiring users to log in again.
:::