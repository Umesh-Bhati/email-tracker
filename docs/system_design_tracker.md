# System Design Concepts Tracker

As we build the Email Tracker App, we will mark which core system design concepts we learn practically, and explicitly list the concepts that this specific architecture doesn't require, so you have a complete mental map of system design.

## ✅ High-Level Design (HLD) Concepts in this Project

These concepts will be practically applied and demonstrated as we build:

- [ ] **Client-Server Model:** You will learn how the Chrome Extension (Client) talks to the Next.js API (Server) over HTTP.
- [ ] **Serverless Architecture:** You will learn how Vercel scales our Next.js API automatically, spinning up "cold starts" instead of maintaining an 'always-on' server.
- [ ] **API Design (RESTful Principles):** You will learn how to structure endpoints (e.g., `GET /api/track/[id]` vs `POST /api/emails`).
- [ ] **OAuth & Authentication:** You will learn how to securely pass user identities (via Supabase & Google OAuth).
- [ ] **Real-Time Communication (WebSockets/PubSub):** You will learn how Supabase pushes database row changes to the Chrome Extension instantly so UI updates in real-time.
- [ ] **Stateless Servers:** You will learn why our API doesn't "remember" anything in memory, relying entirely on the database (a core requirement of Serverless).

## ✅ Low-Level Design (LLD) Concepts in this Project

These concepts cover exactly *how* the code and schemas are written:

- [ ] **Relational Database Design (SQL Schema):** You will learn to design tables (Users, Emails, Logs) with Primary Keys and Foreign Keys.
- [ ] **Asynchronous Processing (Promises/Async-Await):** You will learn how to handle network requests without freezing the Chrome Extension UI.
- [ ] **Data Payloads (JSON):** You will learn how to serialize and deserialize data moving between the Extension and the API.
- [ ] **Separation of Concerns:** You will learn how to keep UI code (React) separate from network code (Service Workers) separate from Database Access logic.

---

## ❌ Concepts NOT Covered by this Project

Because we chose a modern, Serverless/Managed architecture for a small-to-medium scale MVP, the following advanced system design concepts are abstracted away or unnecessary. We won't build these manually:

- **Load Balancing:** Vercel handles this automatically. We won't be configuring Nginx or HAProxy to distribute traffic across EC2 instances.
- **Caching (Redis/Memcached):** Our read volume for past emails isn't high enough yet to justify a caching layer in front of the database.
- **Message Queues (Kafka/RabbitMQ):** We are writing tracking events directly to the database synchronously. Only at massive scale (millions of emails) would we need a queue to buffer incoming tracking pixel hits.
- **Microservices Orchestration (Kubernetes/Docker):** We are building a basic monolith-style API on Vercel. We won't be managing containers.
- **Database Sharding/Replication:** Supabase manages our single PostgreSQL instance. We won't be manually splitting the database across multiple physical drives.
- **NoSQL Schema Design:** We went with a relational database (Postgres). We won't cover document-store optimizations (like MongoDB or DynamoDB).
- **Rate Limiting:** While we *could* implement this, we likely won't for an MVP unless we notice abuse.
