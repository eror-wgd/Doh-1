# PICKO DNS over HTTPS (DoH) Service

A secure, commercial-grade DNS over HTTPS Management System for Cloudflare Workers. It manages users, subscription expirations, traffic allocations, upstream recursive resolvers, and local DNS mapping, and dynamically generates a directly deployable edge `worker.js`.

---

## 🚀 Key Features

- **Subscriber & Subscription Management:** Configure traffic quotas (GB), daily usage limits, expiration dates, and concurrent connection/device metrics.
- **Upstream Resolver Health & Latency Routing:** Support for leading recursive resolvers (Google, Cloudflare, Quad9, AdGuard) with auto-failover, load balancing, and round-robin strategies.
- **Local DNS Bypasses:** Map custom hostnames (`router.home` &rarr; `192.168.1.1`) resolved instantly in memory at Cloudflare's edge in under 1ms.
- **Client IP & Device Tracking:** GeoIP telemetry mapping (Country, City, ASN) to monitor and block unauthorized subscriber profile distributions.
- **Streaming Query Logger:** Dynamic filtering, searching, and exporting of real-time DNS transactions (supports CSV and JSON formats).
- **Diagnostics Tool:** Active ping tool to measure latency and packet-loss percentages for individual subscriber lines.
- **Durable Database Persistence:** Persistent data storing inside `database.json` with secure backup exporter and restore tools.
- **Bilingual Interface:** Supports standard RTL (Persian) and LTR (English) localization on the fly.

---

## 🛠️ System Deployment Guide

This system operates in two parts:
1. **The Management Panel:** Regulates the subscribers, configurations, and compiles workers (Run this server).
2. **The Cloudflare Worker:** Handles real DNS traffic on the Cloudflare edge.

---

### Part 1: Running the Management Panel

The management panel runs as a fullstack Node/Express + React Vite application:

#### 1. Configure Secrets
Open `.env.example` (or create a `.env` file) and specify your environment variables:
```env
GEMINI_API_KEY="your-gemini-key"
APP_URL="your-panel-hosting-url"
```

#### 2. Start Developer Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser.

#### 3. Log In to Panel
Use the pre-seeded secure administrator credentials:
- **Admin Email:** `admin@pickodoh.com`
- **Password:** `admin123`

---

### Part 2: Deploying the Edge Worker (worker.js)

1. Open the **Cloudflare Workers** tab in your Cloudflare dashboard.
2. Click **Create Application** and choose **Create Worker**. Name your worker (e.g., `picko-doh-resolver`).
3. Click **Deploy**. After deployment, click **Edit Code**.
4. In the PICKO Management Panel, navigate to the **Worker Generator** tab.
5. Click **Copy Code** to copy the compiled production-ready script. This contains your active subscribers, bypass domains, and upstream fallbacks.
6. Paste the code into Cloudflare’s editor, click **Save and Deploy**.
7. Test your secure endpoint using a client (e.g. AdGuard, DNS-over-HTTPS profiles):
   - `https://picko-doh-resolver.YOUR-SUBDOMAIN.workers.dev/dns-query/sub-arash`

---

## 🔐 Security Protocols

- **Admin Access Control:** Authenticated JWT session control.
- **Rate-Limiting:** Enforced request boundaries (e.g. max 120 queries/min per subscriber).
- **Database Backups:** Easy migration using instant JSON export and restore tools.
