# Email Tracker App: System Design & Architecture

## High-Level Architecture
To build a highly scalable, "Streak-like" email tracker while keeping costs near zero for the initial stages, we will use a **Serverless Architecture**.

```mermaid
graph TD
    A[User (Gmail)] -->|Chrome Extension| B(Frontend/Extension UI)
    B -->|API Calls / OAuth| C{Next.js Serverless API}
    D[Email Recipient] -->|Opens Email / Clicks Link| C
    C -->|Reads/Writes| E[(Supabase / PostgreSQL)]
    C -->|Realtime Updates| B
```

### 1. Browser Extension (Client)
- **Tech Stack:** React, Vite, CRXjs, TailwindCSS.
- **Responsibilities:**
  - Inject a UI into the Gmail compose window (e.g., a "Track this email" toggle).
  - Intercept the Gmail "Send" action to append a hidden `<img src="API_URL/track/uuid.gif" />` to the email's HTML body.
  - Intercept out-bound links in the compose window and replace them with `API_URL/click/uuid?url=original_url` for click tracking.
  - Display notifications (e.g., "Someone just opened your email!").
  - Provide a sidebar CRM/Dashboard to view opened/clicked statistics.

### 2. Backend API (Serverless)
- **Tech Stack:** Next.js API Routes (hosted on Vercel) or Cloudflare Workers.
- **Responsibilities:**
  - Serve the 1x1 transparent tracking pixel (`GET /track/:id.gif`).
  - Handle link redirections (`GET /click/:id?url=...`).
  - Store extension user data, authentication, and tracking events.
  - Provide endpoints for the Chrome Extension to fetch the tracking history.

### 3. Database (Serverless SQL)
- **Tech Stack:** Supabase (PostgreSQL).
- **Why?** Supabase provides an excellent free tier (500MB database, 2GB bandwidth), built-in authentication (Google OAuth), and Realtime subscriptions via WebSockets so the Extension UI can update instantly when an email is opened.

---

## Low-Level Design (Database Schema)

We will use relational DB design with the following core tables:

### Core CRM Infrastructure

#### `users`
| Column | Type | Description |
| ---- | ---- | ---- |
| `id` | UUID (PK) | Unique user ID |
| `email` | String | User's Gmail address |
| `created_at` | Timestamp | Account creation date |

#### `pipelines` (New: CRM Component)
| Column | Type | Description |
| ---- | ---- | ---- |
| `id` | UUID (PK) | Unique pipeline ID |
| `user_id` | UUID (FK) | Owner of the pipeline |
| `name` | String | e.g., "Sales", "Hiring" |
| `stages` | JSONB | e.g., ["Lead", "Contacted", "Closed"] |

#### `deals` (New: CRM Component)
| Column | Type | Description |
| ---- | ---- | ---- |
| `id` | UUID (PK) | Unique deal/box ID |
| `pipeline_id` | UUID (FK)| Which pipeline it belongs to |
| `name` | String | e.g., "Google Contract" |
| `stage` | String | Current stage |
| `value` | Decimal | Dollar value of the deal |

### Email Tracking Infrastructure

#### `tracked_emails`
| Column | Type | Description |
| ---- | ---- | ---- |
| `id` | UUID (PK) | Unique tracking ID (appended to pixel) |
| `user_id` | UUID (FK) | Sender's user ID |
| `gmail_thread_id` | String | Thread ID from Gmail |
| `subject` | String | Email Subject line |
| `recipient` | String | Intended recipient(s) |
| `status` | Enum | Sent, Opened, Clicked |
| `created_at` | Timestamp | When the email was sent |

### `tracking_logs`
| Column | Type | Description |
| ---- | ---- | ---- |
| `id` | UUID (PK) | Log ID |
| `email_id` | UUID (FK) | Reference to `tracked_emails` |
| `event_type` | Enum | `OPEN` or `CLICK` |
| `ip_address` | String | IP of the recipient |
| `user_agent` | String | Browser/Device details |
| `created_at` | Timestamp | When the event happened |

---

## Cost Effectiveness Breakdown
- **Frontend / Extension hosting:** $0 (Chrome Web Store handles updates/delivery, local execution).
- **Backend / Serverless processing:** $0 (Vercel free tier: 100,000 monthly serverless function executions and 100GB bandwidth; more than enough for thousands of emails).
- **Database:** $0 (Supabase free tier: 500MB DB space, scaling to $25/mo when traffic hits production limits).
- **Total Initial Cost:** ~$0/month to build, test, and launch to the first few hundred users.

---

## Tech Stack Justification & Reasoning
*(This section serves as a reference for future technical blogs and architectural decisions)*

### 1. Database: Supabase (PostgreSQL)
*   **Real-time Capabilities:** Essential for instantly notifying the user when an email is opened via WebSocket subscriptions. Building this infrastructure from scratch is complex.
*   **Relational Data:** Email tracking is relational (Users -> Emails -> Tracking Logs). PostgreSQL models this perfectly and enables complex analytical queries later.
*   **Built-in Auth:** Includes Google OAuth natively, which is perfect since users log in via Gmail.
*   **Alternatives Rejected:**
    *   *NoSQL (Firebase):* Harder to run relational analytical queries as the app scales.
    *   *AWS RDS:* Too expensive to start ($15-30/mo minimum).
    *   *SQLite (Turso):* Requires more manual setup for real-time WebSockets compared to Supabase.

### 2. Backend API: Next.js API Routes (Serverless)
*   **Serverless Economics:** Email tracking traffic is spiky. Serverless functions spin up on demand, meaning we don't pay for idle server time.
*   **Colocation:** Allows keeping the API and any future web dashboard in the exact same repository.
*   **Edge Network:** Vercel's global edge nodes reduce latency when tracking pixels are requested worldwide.
*   **Alternatives Rejected:**
    *   *Express.js on a VPS (EC2/DigitalOcean):* Requires constant payment even with zero users, plus OS/SSL maintenance.
    *   *AWS Lambda + API Gateway:* Excessive boilerplate and configuration time for an early-stage product.
    *   *Cloudflare Workers:* While faster/cheaper at high scale, they lack full Node.js compatibility, which might limit future package usage (like complex email parsing).

### 3. Frontend: React + Vite + CRXjs (Chrome Extension)
*   **Developer Experience:** React effortlessly manages the state of complex UIs (like a CRM sidebar in Gmail) compared to vanilla DOM manipulation.
*   **CRXjs Plugin:** Handles Hot Module Replacement (HMR) specifically for Chrome Extensions, drastically speeding up development.
*   **Alternatives Rejected:**
    *   *Vanilla JS/jQuery:* Unmaintainable as UI complexity grows.
    *   *Plasmo:* Introduces proprietary folder structures, whereas Vite + CRXjs stays closer to standard React development, making future hiring easier.
