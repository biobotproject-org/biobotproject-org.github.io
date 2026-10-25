---
id: architecture
title: Architecture
sidebar_label: Architecture
sidebar_position: 4
---

# Architecture

## System overview

```
node (Nano ESP32, BME688, BMV080)
  -> on-device anomaly detector
  -> Blues Notecard (cellular) -> Blues Notehub
  -> Notehub HTTP route -> POST /ingest/notehub   (Wildfire Alarm API)
  -> MariaDB
  -> dashboard (React), incident emails
```

The API is a Node.js / Express application on MariaDB through the Sequelize ORM. Code is layered: `routes/` handle HTTP and validation and stay thin, `services/` hold the logic, `models/` define the tables.

## Notehub ingest

Notehub wraps every note in an envelope with the note file name, the node's JSON body, the Notecard UID, a timestamp and the best known location. The API dispatches on the file name:

| File | Sent | Effect |
|---|---|---|
| `device.qo` | once at boot | creates or updates the device |
| `data.qo` | every 10 minutes | stores a batch of readings, each tagged with the node's anomaly severity and score |
| `alert.qo` | immediately | opens, updates or closes an incident and emails the hosts |
| anything else | system notes | refreshes the node's last-seen time, location and supply voltage |

**Idempotency.** Notehub retries any delivery that does not get a 2xx answer. Every event carries a UUID: readings are stored under `<event>:<index>`, and a repeated `alert.qo` returns `duplicate_ignored`. A retry therefore never duplicates data or re-sends an email.

**Authentication.** The Notehub route sends an **ingest key** created in the dashboard (API Keys, scope "Notehub ingest"). Such a key is accepted only by `POST /ingest/notehub` and cannot read anything.

## Incidents

An incident is one continuous anomaly episode on one node, from the moment the node raises it until it clears. Severities are `none`, `watch`, `alert`, `critical` and `fault`. Every raise, update and clear is kept as an incident event, and each one is emailed (plain text, readable on any phone) with the current readings against the node's baseline and a map link. After driving out, the host records the outcome: `fire`, `false_alarm`, `sensor_fault` or `unknown`.

## Live map

`GET /map` returns everything the dashboard's live map draws:

- every node with its position, last severity and last-seen time;
- for each open incident, the current wind at the node from [Open-Meteo](https://open-meteo.com/) and a spread envelope for 30, 60 and 120 minutes;
- [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) satellite hotspots from the last 48 hours within 25 km of any node.

The spread envelope is a planning aid, not a fire model. Forward spread is taken as 10% of the 10-m wind speed (Cruz & Alexander 2019), and the shape uses the Canadian FBP length-to-breadth ratio. It ignores terrain and fuel moisture. Weather is cached for 10 minutes, satellite data for 15.

## Data model

| Model | Description |
|---|---|
| `User` | Dashboard accounts, role `admin` or `user` |
| `ApiKey` | Hashed API keys, scope `user` (acts as the owner) or `ingest` (Notehub only) |
| `Device` | Sensor nodes, with Notecard UID, location, last severity and voltage |
| `Reading` | One value per row: type, unit, timestamp, batch id, anomaly severity and score |
| `Incident` | An anomaly episode on one node, with peak severity and outcome |
| `IncidentEvent` | Each raise, update or clear, with readings and baseline |
| `Alert`, `AlertThreshold` | Older server-side threshold alerts, kept for compatibility |

The schema is applied at startup with `sequelize.sync({ alter: true })`. There are no migrations yet.

## Security model

- Dashboard users sign in and receive a JWT that is valid for 24 hours. Scripts can use a user-scope API key (`sk_…`) instead.
- Roles come from the database on every request, never from the token or the request body. Registration always creates a `user`; only an admin can promote someone.
- An admin cannot demote or delete themselves, and the last admin is protected.
- Ingest keys can reach `POST /ingest/notehub` only.
- Secrets (`JWT_SECRET`, database passwords, SMTP credentials, `FIRMS_MAP_KEY`) live in `.env`, which is never committed.

:::tip Rotate your JWT secret
If you suspect `JWT_SECRET` has leaked, rotate it. Every existing token becomes invalid and users sign in again.
:::
