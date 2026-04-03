---
id: deployment
title: Deployment
sidebar_label: Deployment
sidebar_position: 6
---

# Deployment

This page covers deploying the biobot-cloud API to a production server, and separately, how to build and host this Docusaurus documentation site on GitHub Pages.

---

## Deploying the API

:::info Docker support coming soon
A Dockerfile and `docker-compose.yml` will be added in a future release, making it possible to run the API and database as containers without manual dependency installation.
:::

### Recommended: DigitalOcean Droplet or VPS

BioBot Cloud is a standard Node.js/Express app that can run on any Linux VPS. The following steps assume Ubuntu 22.04.

#### 1. Provision the server

Create a VPS with at least 1 GB RAM. Install Node.js and MySQL:

```bash
# Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

#### 2. Clone and install

```bash
git clone https://github.com/biobotproject-org/biobot-cloud.git
cd biobot-cloud
npm install --production
```

#### 3. Configure environment

Create a `.env` file with production values. **Do not reuse development credentials.**

```env
DB_NAME=biobot_prod
DB_USER=biobot
DB_PASSWORD=<strong_random_password>
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=<long_random_secret_min_32_chars>
SHOW_SQL=false
PORT=3001
```

Set restrictive permissions on the file:

```bash
chmod 600 .env
```

#### 4. Create the database and user

```sql
CREATE DATABASE biobot_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'biobot'@'localhost' IDENTIFIED BY '<your_password>';
GRANT ALL PRIVILEGES ON biobot_prod.* TO 'biobot'@'localhost';
FLUSH PRIVILEGES;
```

#### 5. Run with PM2

Use PM2 to keep the server running across reboots:

```bash
npm install -g pm2
pm2 start server.js --name biobot-cloud
pm2 save
pm2 startup
```

#### 6. Reverse proxy with Nginx

Expose the API on port 443 via Nginx and a Let's Encrypt certificate:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/biobot-cloud`:

```nginx
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and secure:

```bash
sudo ln -s /etc/nginx/sites-available/biobot-cloud /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.yourdomain.com
sudo systemctl reload nginx
```

---

## Hosting the Docs on GitHub Pages

The documentation lives in [biobot-docs](https://github.com/biobotproject-org/biobot-docs) as a Docusaurus site. GitHub Pages serves it for free directly from that repository.

### 1. Set Up Docusaurus in biobot-docs

If not already initialized:

```bash
npx create-docusaurus@latest biobot-docs classic
cd biobot-docs
```

Copy the markdown files from this repo's `docs/` folder into the Docusaurus `docs/` directory.

### 2. Configure `docusaurus.config.js`

```js
module.exports = {
  title: 'BioBot Documentation',
  tagline: 'Wildfire detection sensor network',
  url: 'https://biobotproject-org.github.io',
  baseUrl: '/biobot-docs/',
  organizationName: 'biobotproject-org',
  projectName: 'biobot-docs',
  trailingSlash: false,

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',   // serve docs at root
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
      },
    ],
  ],
};
```

### 3. Add a GitHub Actions Workflow

Create `.github/workflows/deploy-docs.yml` in the `biobot-docs` repository:

```yaml
name: Deploy Docusaurus to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### 4. Enable GitHub Pages

In the `biobot-docs` repository settings:

1. Go to **Settings → Pages**
2. Set **Source** to `Deploy from a branch`
3. Select the `gh-pages` branch, `/ (root)` folder
4. Save

After the first push to `main`, GitHub Actions will build the site and publish it. It will be available at:

```
https://biobotproject-org.github.io/biobot-docs/
```

### 5. Custom Domain (Optional)

To serve docs from a custom domain (e.g. `docs.yourdomain.com`):

1. Add a `CNAME` file in `biobot-docs/static/` containing `docs.yourdomain.com`
2. Update `url` in `docusaurus.config.js` to `https://docs.yourdomain.com` and `baseUrl` to `/`
3. Add a CNAME DNS record pointing `docs.yourdomain.com` to `biobotproject-org.github.io`

---

## Environment Variables in Production

:::danger Never commit real secrets
The `.env` file in this repository contains example placeholder values. Before deploying:
- Generate a new `JWT_SECRET` (use `openssl rand -base64 48` to generate one)
- Use a non-root MySQL user with a strong password
- Restrict `.env` file permissions to `600`
- Consider a secrets manager (e.g. AWS Secrets Manager, Doppler) for team deployments
  :::