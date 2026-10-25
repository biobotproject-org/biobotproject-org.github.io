---
id: deployment
title: Deployment
sidebar_label: Deployment
sidebar_position: 6
---

# Deployment

Wildfire Alarm runs as three containers from [biobot-infrastructure](https://github.com/biobotproject-org/biobot-infrastructure): MariaDB, the API, and the dashboard (nginx serving the React build and proxying `/api/` to the API). One public hostname is enough.

```
browser -> your reverse proxy (443, TLS)
        -> frontend container (nginx, React build)
             -> /api/ -> backend:3000   (compose network only)
                           -> db:3306   (compose network only)
```

## 1. Server

Any Linux host with Docker and Docker Compose v2.24 or later; 1 GB of RAM is enough. Point a DNS `A` record for your dashboard hostname at it.

## 2. Install

```bash
sudo mkdir -p /opt/wildfire-alarm && sudo chown $USER /opt/wildfire-alarm
cd /opt/wildfire-alarm
git clone --recurse-submodules https://github.com/biobotproject-org/biobot-infrastructure.git
cd biobot-infrastructure
cp .env.example .env && chmod 600 .env    # fill in, see Getting Started
```

Set `DASHBOARD_URL` to the public address so incident emails link to it.

## 3. Publish only on loopback

The base compose file publishes ports 80 and 3000 for local use. On a server, publish only the dashboard and only on loopback, behind your reverse proxy:

```bash
cp docker-compose.prod.example.yml docker-compose.override.yml
docker compose config | grep -A4 ports    # check the merged result
docker compose up -d --build
```

The example publishes the frontend on `127.0.0.1:8085`. The API and the database are not published at all.

## 4. Reverse proxy and TLS

With nginx and Certbot on the host:

```nginx
server {
    server_name app.example.org;
    location / {
        proxy_pass http://127.0.0.1:8085;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d app.example.org
```

## 5. Connect Notehub

1. In the dashboard, open **API Keys** and create a key with scope **Notehub ingest**. The page shows the exact route settings.
2. In Notehub, add a **General HTTP/HTTPS** route to `https://app.example.org/api/ingest/notehub` with the header `Authorization: Bearer <ingest key>`, the note files `device.qo`, `data.qo`, `alert.qo` (and `_health.qo` for supply voltage), and JSON with the default transform.

The API answers every valid event with a 2xx code, and repeated deliveries are ignored, so Notehub retries are safe.

## Updating

Work as the user that owns the checkout, not as root. Root-owned files in `.git` break later pulls.

```bash
cd /opt/wildfire-alarm/biobot-infrastructure
git pull
git submodule update --init
docker compose build backend frontend      # only what changed
docker compose up -d --no-deps backend frontend
docker compose logs --tail=50 backend      # look for "Database synchronized"
```

Schema changes are applied when the API starts. Before an update that changes the schema, take a backup.

## Backups

A daily dump with 14 days of retention, as a crontab entry:

```
30 3 * * * cd /opt/wildfire-alarm/biobot-infrastructure && docker compose exec -T db sh -c 'mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" --single-transaction biobot' | gzip > /opt/wildfire-alarm/backups/biobot-$(date +\%F).sql.gz && find /opt/wildfire-alarm/backups -name 'biobot-*.sql.gz' -mtime +14 -delete
```

Restore:

```bash
gunzip -c biobot-YYYY-MM-DD.sql.gz | docker compose exec -T db sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" biobot'
```

## Rolling back

```bash
git log --oneline -5                       # find the previous commit
git checkout <commit> && git submodule update --init
docker compose build backend frontend && docker compose up -d --no-deps backend frontend
```

Return with `git checkout main` once the fix is in.

---

## This documentation site

This site is the [biobotproject-org.github.io](https://github.com/biobotproject-org/biobotproject-org.github.io) repository, built with Docusaurus. Every push to `main` builds it and publishes it to GitHub Pages through `.github/workflows/deploy.yml`. To preview locally:

```bash
npm ci
npm start
```
