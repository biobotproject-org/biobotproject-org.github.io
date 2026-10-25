---
id: api-reference
title: API Reference
sidebar_label: API Reference
sidebar_position: 3
---

# API Reference

The Wildfire Alarm API is plain HTTP and JSON. In Docker deployments the dashboard reaches it under `/api/` on the same host, for example `https://app.example.org/api/incidents`. Locally it is served directly on `http://localhost:3000`.

:::tip Live API docs
A running server also serves interactive Swagger documentation at `/api-docs`. It is generated from the code and always matches the deployed version, including every query parameter and response field.
:::

## Authentication

Protected endpoints take a token in the `Authorization` header:

```
Authorization: Bearer <jwt from /login>
Authorization: Bearer sk_<api key>
```

| Credential | Obtained from | Can do |
|---|---|---|
| JWT | `POST /login`, valid 24 h | everything the user's role allows |
| User API key | `POST /api-keys` with `scope: "user"` | acts as the owning user, for scripts |
| Ingest key | `POST /api-keys` with `scope: "ingest"` | only `POST /ingest/notehub` |

Endpoints marked **admin** also require the user's role to be `admin`. The role is read from the database on every request.

---

## Account

### `POST /register`

```json
{ "username": "operator1", "email": "operator1@example.com", "password": "Str0ngPassw0rd!" }
```

Returns `201` with `{ message, user: { id, username, email, role }, token }`. New accounts always get the role `user`; a `role` in the body is ignored.

### `POST /login`

```json
{ "username": "operator1", "password": "Str0ngPassw0rd!" }
```

`email` works in place of `username`. Returns `200` with `{ message, user, token }`.

### `GET /me`

The signed-in user with the role currently in the database: `{ id, username, email, role }`.

### API keys

| Method | Path | Notes |
|---|---|---|
| `POST` | `/api-keys` | Body `{ name, description?, scope: "user" \| "ingest" }`. The key itself is returned once, in `apiKey.key` |
| `GET` | `/api-keys` | The caller's keys with scope and `lastUsedAt`, never the key itself |
| `DELETE` | `/api-keys/:id` | Revokes a key |

---

## Notehub ingest

### `POST /ingest/notehub`

Target of the Notehub HTTP route. Authenticate with an ingest key. The body is the Notehub event envelope; the API dispatches on its `file` field:

| `file` | Body from the node | Result `action` |
|---|---|---|
| `device.qo` | `{ deviceId, name, type }` | `device_created` / `device_updated` |
| `data.qo` | `{ requests: [{ deviceId, readings: [{ readingType, unit, value, timestamp }], anomaly: { severity, score } }] }` | `readings_stored` |
| `alert.qo` | `{ deviceId, event: "raised" \| "updated" \| "cleared", severity, score, signals, readings, baseline, timestamp }` | `incident_opened` / `incident_updated` / `incident_closed` / `duplicate_ignored` |
| anything else | system notes such as `_health.qo` | `ignored` (last seen, location and voltage are still refreshed) |

A redelivered event (same Notehub `event` UUID) is acknowledged with 200 and not stored again. A malformed body returns 400.

---

## Devices

| Method | Path | Notes |
|---|---|---|
| `GET` | `/devices` | All nodes, with position, last severity, last seen and voltage |
| `GET` | `/devices/:id` | One node, by database id or `deviceId` |
| `POST` | `/devices` | Register a node by hand: `{ deviceId, name, type, status? }`. Nodes normally register themselves through `device.qo` |
| `PATCH` | `/devices/:id/status` | `{ status: "active" \| "inactive" \| "maintenance" \| "hibernation" }`. Owner or admin |
| `DELETE` | `/devices/:id` | Owner or admin |

## Readings

### `GET /readings`

Readings grouped by batch, newest first, with each batch's anomaly severity and score.

| Query parameter | Meaning |
|---|---|
| `deviceId` | One node, by database id, `deviceId` (e.g. `biobot-001`) or Notecard UID (`dev:…`). An unknown id returns an empty page |
| `readingType` | e.g. `pm25`, `gasResistance`, `temperature`, `humidity` |
| `startDate`, `endDate` | ISO 8601 time range |
| `minValue`, `maxValue`, `unit` | Value filters |
| `sortBy`, `sortOrder` | Sorting, default `timestamp DESC` |
| `page`, `limit` | Paging |

## Incidents

| Method | Path | Notes |
|---|---|---|
| `GET` | `/incidents` | Newest first. Filters: `status=open\|closed`, `deviceId`, `limit` |
| `GET` | `/incidents/:id` | One incident with its full event timeline |
| `GET` | `/incidents/:id/context` | Current wind, spread envelope (open incidents only) and nearest satellite hotspot |
| `POST` | `/incidents/:id/acknowledge` | Record the drive-out: `{ outcome: "fire" \| "false_alarm" \| "sensor_fault" \| "unknown", notes? }` |

## Live map

### `GET /map`

Everything the live map draws, in one call: `devices`, `openIncidents` (each with `weather`, `spread` and `satellite`), and `satellite.hotspots` within 25 km of any node over the last 48 hours. `satellite.status` is `not_configured` until `FIRMS_MAP_KEY` is set. Weather and satellite lookups are cached, so polling every 15 seconds is fine.

### Demo fire (admin)

| Method | Path | Notes |
|---|---|---|
| `POST` | `/demo/fire` | Optional `{ latitude, longitude }`. Starts a scripted fire on five demo nodes, using the live wind there. No emails are sent |
| `GET` | `/demo` | State of the demo |
| `DELETE` | `/demo` | Stops the demo and deletes every demo node and its data |

## Users (admin)

| Method | Path | Notes |
|---|---|---|
| `GET` | `/users` | All users, with counts of ingest keys, other keys and owned devices |
| `PATCH` | `/users/:id/role` | `{ role: "admin" \| "user" }`. You cannot demote yourself or the last admin |
| `DELETE` | `/users/:id` | Revokes the user's keys and keeps incident outcomes they recorded. You cannot delete yourself or the last admin |

Deleting a user who owns an ingest key stops every Notehub route that uses that key.

## API health

`GET /api/health/stats`, `/api/health/endpoints`, `/api/health/latency-trends` and `/api/health/errors` report request counts, latency and recent errors, as shown on the dashboard's API Health page.

## Older endpoints

These came before the Notehub ingest path and are kept for compatibility:

| Method | Path | Notes |
|---|---|---|
| `GET` / `POST` / `DELETE` | `/sensordata` | Direct reading submission and query, with server-side threshold checks |
| `GET` | `/alerts`, `POST /alerts/:id/acknowledge` | Threshold alerts. Node alerts also appear here, mapped to `low`/`medium`/`high`/`critical` |
| `GET` | `/power-status` | Power events |

---

## Errors

Errors are JSON with an `error` field:

```json
{ "error": "Incident not found" }
```

Validation failures add the offending fields:

```json
{ "error": "Validation failed", "details": [{ "field": "name", "message": "name is required" }] }
```

| Status | Meaning |
|---|---|
| `400` | Malformed body or missing fields |
| `401` | Missing, invalid or expired token or key |
| `403` | Authenticated, but not allowed (for example, not an admin) |
| `404` | Not found |
| `409` | Conflict, for example demoting the last admin or starting a second demo |
| `422` | Validation failed |
| `503` | The database is reconnecting; try again shortly |
