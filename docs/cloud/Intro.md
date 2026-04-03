---
id: intro
title: BioBot Cloud
sidebar_label: Introduction
sidebar_position: 1
slug: /
---

# BioBot Cloud

**biobot-cloud** is the server-side backend for the BioBot wildfire detection platform. It provides a REST API built with Node.js that handles data ingestion from sensor nodes, stores readings in a MySQL database, manages JWT-based authentication, and runs an alert engine to notify operators when wildfire risk thresholds are exceeded.

## What It Does

BioBot Cloud sits between the physical sensor network and the web dashboard:

- Receives telemetry from field-deployed BMV080/BME688 sensor nodes
- Persists sensor readings, device registrations, and alert events to MySQL
- Authenticates API consumers (dashboard, operators) using JWT
- Evaluates incoming readings against configurable alert thresholds
- Exposes a RESTful interface for the [biobot-dashboard](https://github.com/biobotproject-org/biobot-dashboard) frontend

## Repository Layout

```
biobot-cloud/
├── config/          # Database connection and app configuration
├── middleware/      # Express middleware (auth, error handling, etc.)
├── models/          # Sequelize data models (devices, readings, alerts, users)
├── routes/          # API route handlers
├── server.js        # Entry point — Express app setup and startup
└── .env             # Environment variables (do not commit secrets)
```

## Related Repositories

| Repo | Description |
|---|---|
| [biobot-hardware](https://github.com/biobotproject-org/biobot-hardware) | KiCad schematics, PCB layout, BOM, enclosure STLs |
| [biobot-firmware](https://github.com/biobotproject-org/biobot-firmware) | ESP32 firmware, BME688 BSEC integration, power management |
| [biobot-gateway](https://github.com/biobotproject-org/biobot-gateway) | LoRa mesh relay, Meshtastic config, internet uplink |
| [biobot-cloud](https://github.com/biobotproject-org/biobot-cloud) | **This repo** — REST API, DB schema, alert engine |
| [biobot-dashboard](https://github.com/biobotproject-org/biobot-dashboard) | React web dashboard for visualization and alert management |
| [biobot-docs](https://github.com/biobotproject-org/biobot-docs) | Build guides, deployment handbook, calibration procedures |
| [biobot-data](https://github.com/biobotproject-org/biobot-data) | Open datasets from test burns, ML training data |