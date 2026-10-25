---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 2
---

# Getting Started

Run the whole stack (database, API and dashboard) on your machine, then feed it data from a simulated node. No hardware or Notehub account is needed.

## Prerequisites

- **Docker** with Docker Compose v2.24 or later
- **Git**
- **Python 3**, for the node simulator
- For working on the API without Docker: **Node.js 20** or later

## 1. Clone the stack

The API and the dashboard are git submodules of `biobot-infrastructure`:

```bash
git clone --recurse-submodules https://github.com/biobotproject-org/biobot-infrastructure.git
cd biobot-infrastructure
```

## 2. Configure

```bash
cp .env.example .env
```

Fill in at least `DB_PASSWORD`, `DB_ROOT_PASSWORD` and `JWT_SECRET`. Generate each value with `openssl rand -base64 32`.

| Variable | Purpose |
|---|---|
| `DB_ROOT_PASSWORD`, `DB_PASSWORD` | MariaDB root and application passwords |
| `DB_NAME`, `DB_USER` | Database and user name (default `biobot`) |
| `JWT_SECRET` | Signs dashboard login tokens |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Outgoing mail for incident emails. Leave `SMTP_HOST` empty to disable |
| `ALERT_EMAIL_FROM`, `ALERT_EMAIL_TO` | Sender, and comma-separated recipients of incident emails |
| `DASHBOARD_URL` | Public dashboard address, used for links in emails |
| `FIRMS_MAP_KEY` | Optional. Free [NASA FIRMS key](https://firms.modaps.eosdis.nasa.gov/api/map_key/) for the satellite cross-check |
| `NOTEHUB_INGEST_TOKEN` | Optional and legacy. Use a dashboard ingest key instead |

:::warning Never commit `.env`
`.env` is git-ignored. Keep it that way.
:::

## 3. Start

```bash
docker compose up -d --build
```

| What | Where |
|---|---|
| Dashboard | http://localhost |
| API | http://localhost:3000 |
| Interactive API docs (Swagger) | http://localhost:3000/api-docs |

The API creates its tables on first start.

## 4. Create an account

Open the dashboard and register. New accounts are ordinary users. To make the first admin, run this once:

```bash
docker compose exec -T db sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" biobot -e "update Users set role=\"admin\" where username=\"YOUR_NAME\""'
```

After that, admins can promote others from the **Users** page.

## 5. Simulate a node

In the dashboard, go to **API Keys**, create a key with scope **Notehub ingest**, and copy it. Then:

```bash
INGEST_TOKEN=<your ingest key> python3 biobot-cloud/scripts/notehub-sim.py --device biobot-010 --name "Test Ridge"
```

The simulator sends Notehub-shaped `device.qo`, `data.qo` and `alert.qo` events: the node registers, reports readings, raises an alert, escalates and clears. Add `--leave-open` to keep the incident open.

An admin can also start a scripted **demo fire** from the Live Map page. It runs five demo nodes for about 40 seconds and sends no emails.

## Working on the API without Docker

```bash
cd biobot-cloud
npm ci
DB_DIALECT=sqlite DB_PASSWORD=x JWT_SECRET=dev npm run dev
npm test        # in-memory SQLite, no database or mail server needed
```

SQLite is a development convenience only. Production runs on MariaDB.

## Next steps

- [API Reference](./api-reference)
- [Deployment](./deployment)
