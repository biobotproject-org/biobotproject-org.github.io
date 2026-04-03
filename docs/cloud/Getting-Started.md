---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 2
---

# Getting Started

This guide walks you through cloning the repository, installing dependencies, configuring your environment, and running the server locally.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** v18 or later (`node --version` to check)
- **npm** v9 or later (comes with Node.js)
- **MySQL** 8.x running locally or accessible remotely
- **Git**

## 1. Clone the Repository

```bash
git clone https://github.com/biobotproject-org/biobot-cloud.git
cd biobot-cloud
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

The server reads its configuration from a `.env` file in the project root. A template is already committed — copy and edit it before starting:

```bash
cp .env .env.local  # optional — or edit .env directly
```

Open `.env` and set the values appropriate for your environment:

```env
# Database
DB_NAME=firethingys
DB_USER=root
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=3306

# Authentication
JWT_SECRET=replace_this_with_a_long_random_secret

# Logging
SHOW_SQL=false

# Server
PORT=3001
```

:::warning Do not commit real secrets
The `.env` file in this repository contains placeholder values. Before deploying, replace `DB_PASSWORD` and `JWT_SECRET` with strong, unique values and ensure `.env` is in your `.gitignore`.
:::

| Variable | Description | Default |
|---|---|---|
| `DB_NAME` | MySQL database name | `firethingys` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | *(set this)* |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | Secret used to sign JWT tokens | *(set this)* |
| `SHOW_SQL` | Log raw SQL queries to console | `false` |
| `PORT` | Port the Express server listens on | `3001` |

## 4. Set Up the Database

Create the MySQL database if it doesn't already exist:

```sql
CREATE DATABASE firethingys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The server uses Sequelize ORM with `sync` to create tables on startup. On first run, the schema will be applied automatically. You do not need to run migrations manually for a fresh install.

## 5. Start the Server

```bash
node server.js
```

Or, if you have `nodemon` installed for development (auto-reloads on file changes):

```bash
npx nodemon server.js
```

You should see output similar to:

```
Database connection established.
Server running on port 3001
```

## 6. Verify It's Running

```bash
curl http://localhost:3001/
```

The API should respond. You're ready to start making requests.

## Next Steps

- Read the [API Reference](./api-reference) to understand available endpoints
- Set up the [Alert Engine](./alert-engine) thresholds
- Deploy to production using the [Deployment Guide](./deployment)