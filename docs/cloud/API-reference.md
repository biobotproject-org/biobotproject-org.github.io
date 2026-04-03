---
id: api-reference
title: API Reference
sidebar_label: API Reference
sidebar_position: 3
---

# API Reference

BioBot Cloud exposes a RESTful HTTP API. All endpoints are served from the base URL of your deployed instance (e.g. `http://localhost:3001`).

:::info Live API docs coming soon
In a future release, this documentation will also be served directly from the API itself (e.g. `GET /api/docs`). Once available, that endpoint will always reflect the current deployed version of the server.
:::

## Authentication

Protected endpoints require either a JSON Web Token or an API key passed in the `Authorization` header.

**JWT (obtained via `/login`):**

```
Authorization: Bearer <your_jwt_token>
```

**API key (obtained via `/api-keys`):**

```
Authorization: Bearer sk_<your_api_key>
```

---

## Auth Endpoints

### `POST /register`

Register a new user account.

**Request body:**

```json
{
  "username": "operator1",
  "email": "operator1@example.com",
  "password": "securepassword"
}
```

**Response `201`:**

```json
{
  "message": "User registered successfully.",
  "userId": 1
}
```

---

### `POST /login`

Authenticate and receive a JWT.

**Request body:**

```json
{
  "email": "operator1@example.com",
  "password": "securepassword"
}
```

**Response `200`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## API Key Endpoints

### `POST /api-keys`

Create a new API key for use with device integrations and automated ingestion.

**Request body:**

```json
{
  "name": "My API Key"
}
```

**Response `201`:**

```json
{
  "key": "sk_8a6b6d4fb38feaa0b5b225d8306b36049c679cb89c15bbab1f3bdc0163ef6dd4",
  "name": "My API Key"
}
```

🔒 *Requires authentication.*

---

## Device Endpoints

Devices represent individual sensor nodes deployed in the field.

### `GET /devices`

Returns a list of all registered sensor nodes.

🔒 *Requires authentication.*

**Response `200`:**

```json
[
  {
    "id": 1,
    "deviceId": "sensor-001",
    "name": "Fire Sensor Unit 1",
    "type": "fire-monitor",
    "status": "active"
  }
]
```

---

### `POST /devices`

Register a new sensor node.

🔒 *Requires authentication.*

**Request body:**

```json
{
  "deviceId": "sensor-001",
  "name": "Fire Sensor Unit 1",
  "type": "fire-monitor",
  "status": "active"
}
```

**Response `201`:**

```json
{
  "id": 1,
  "deviceId": "sensor-001",
  "name": "Fire Sensor Unit 1"
}
```

---

### `PATCH /devices/:id/status`

Update the status of a registered sensor node.

🔒 *Requires authentication.*

**Request body:**

```json
{
  "status": "active"
}
```

**Response `200`:**

```json
{
  "message": "Device status updated.",
  "deviceId": 1
}
```

---

### `DELETE /devices/:id`

Remove a registered sensor node.

🔒 *Requires authentication.*

**Response `200`:**

```json
{
  "message": "Device deleted.",
  "deviceId": 3
}
```

---

## Sensor Data Endpoints

### `GET /sensordata`

Retrieve recent sensor readings.

🔒 *Requires authentication.*

**Response `200`:**

```json
[
  {
    "deviceId": "sensor-001",
    "readings": [
      { "value": 67, "unit": "°F", "readingType": "temperature" },
      { "value": 41, "unit": "%", "readingType": "humidity" }
    ]
  }
]
```

---

### `POST /sensordata`

Submit one or more sensor readings in a single batch. This is the primary data ingestion endpoint called by the gateway.

**Request body:**

```json
{
  "requests": [
    {
      "deviceId": "sensor-001",
      "readings": [
        { "value": 67, "unit": "°F", "readingType": "temperature" },
        { "value": 41, "unit": "%", "readingType": "humidity" }
      ]
    },
    {
      "deviceId": "sensor-002",
      "readings": [
        { "value": 76, "unit": "°F", "readingType": "temperature" }
      ]
    }
  ]
}
```

**Response `201`:**

```json
{
  "message": "Readings ingested.",
  "count": 2
}
```

---

### `DELETE /sensordata`

Delete sensor readings for a specific device.

🔒 *Requires authentication.*

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `deviceId` | string | The device whose readings should be deleted |

**Example:**

```
DELETE /sensordata?deviceId=device-123
```

---

## Power Status Endpoints

### `GET /power-status`

Returns the current power status of sensor nodes.

🔒 *Requires authentication.*

---

## Health Endpoints

These endpoints expose API observability data and do not require authentication.

### `GET /api/health/stats`

Returns overall API health statistics.

---

### `GET /api/health/endpoints`

Returns per-endpoint health and availability information.

---

### `GET /api/health/latency-trends`

Returns latency trend data across API endpoints.

---

### `GET /api/health/errors`

Returns a log of recent API errors.

---

## Error Responses

All endpoints return standard error shapes:

```json
{
  "error": "Unauthorized",
  "message": "A valid Bearer token is required."
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad request -- malformed body or missing required fields |
| `401` | Unauthorized -- missing or invalid token or API key |
| `404` | Resource not found |
| `500` | Internal server error |