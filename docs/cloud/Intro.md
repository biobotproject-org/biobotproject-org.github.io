---
id: intro
title: Wildfire Alarm Cloud
sidebar_label: Introduction
sidebar_position: 1
slug: /
---

# Wildfire Alarm Cloud

**biobot-cloud** is the server-side backend for Wildfire Alarm. It is a Node.js / Express API on MariaDB (Sequelize ORM) that receives sensor data from Blues Notehub, turns node alerts into incidents, emails the hosts, and serves the dashboard.

## What it does

- Receives Notehub events at `POST /ingest/notehub`: node registration (`device.qo`), batched readings (`data.qo`) and alerts (`alert.qo`). Every event is idempotent, so a Notehub retry never stores data twice.
- Opens, escalates and closes **incidents** from node alerts, and emails the hosts at each step.
- Records what a host found on site: fire, false alarm, sensor fault or unknown.
- Serves the live map: node positions, current wind (Open-Meteo), a spread envelope for open incidents, and NASA FIRMS satellite hotspots.
- Authenticates dashboard users with JWT and API keys. Notehub uses a separate **ingest key** that can only deliver data.
- Lets admins manage users and run a demo fire for presentations.

## Repository layout

```
biobot-cloud/
├── config/       # Sequelize connection from environment variables
├── middleware/   # authentication, admin check, validation, API health tracking
├── models/       # Sequelize models
├── routes/       # HTTP routes with Swagger docs; thin, call services
├── services/     # ingest, incidents, notifications, weather, satellite, demo, users
├── scripts/      # notehub-sim.py, a node simulator
├── test/         # node --test suites on in-memory SQLite
├── app.js        # builds the Express app
└── server.js     # connects to the database and starts listening
```

## Related repositories

| Repo | Description |
|---|---|
| [biobot-firmware](https://github.com/biobotproject-org/biobot-firmware) | Node firmware: sensors, on-device anomaly detection, Notecard uplink |
| [biobot-hardware](https://github.com/biobotproject-org/biobot-hardware) | Carrier PCB (Altium), gerbers, BOM |
| [biobot-cloud](https://github.com/biobotproject-org/biobot-cloud) | **This component**: API, incidents, alerts |
| [biobot-dashboard](https://github.com/biobotproject-org/biobot-dashboard) | React dashboard |
| [biobot-infrastructure](https://github.com/biobotproject-org/biobot-infrastructure) | Docker Compose stack for deployment |
| [biobot-data](https://github.com/biobotproject-org/biobot-data) | Open datasets from test burns |
