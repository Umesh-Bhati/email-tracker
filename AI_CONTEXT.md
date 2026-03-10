# Project: Email Tracker (Streak Alternative)
**Goal:** Build a cost-effective, real-time email tracking application (Chrome Extension + Serverless API) while learning System Design fundamentals.

## 🤖 AI Assistant Instructions
**To any AI (Claude CLI, Cursor, Copilot, etc.) reading this file:**
This file serves as the memory and context marker for this project. The user is transitioning between different AI models, and you must pick up exactly where the last AI left off. 

### Current Project State
*   **Phase:** Phase 2 (Project Setup)
*   **Completed:** Phase 1 (System Architecture & Requirements). Specifically:
    1. Designed High-Level Architecture (Chrome Extension Client, Next.js Serverless API, Supabase).
    2. Designed Low-Level Architecture (Database Schema: Users, Emails, Tracking Logs).
    3. Evaluated a cost-effective $0 tech stack.
    4. Created a learning tracker for system design concepts (`system_design_tracker.md`).
*   **Next Steps:** 
    1. Initialize the backend (Next.js serverless API).
    2. Initialize the frontend (React + Vite + CRXjs Chrome Extension).
    3. Setup Supabase (PostgreSQL).

### Architecture Decisions (Do NOT Deviate)
*   **Package Manager:** Must use `pnpm` strictly. Do not use `npm` or `yarn`.
*   **Frontend Client:** React + Vite + CRXjs Chrome Extension. (Injects UI into Gmail, appends `<img>` pixel on send).
*   **Backend Server:** Next.js Serverless API on Vercel. (Stateless, auto-scaling).
*   **Database:** Supabase / PostgreSQL. (Using WebSockets for real-time notifications).

### Pedagogical Goal (CRITICAL)
The user is a software developer with practical experience in the MERN stack, React Native, and AWS Serverless applications. However, they lack theoretical System Design knowledge. **Do NOT just write code.** 
Before implementing any feature or tool, you must explicitly explain the underlying system design concept at a **Junior-to-Mid Level Engineer** standard. Strip away the "magic" of modern wrappers. Use practical software engineering terminology but explain the *why* behind it (e.g., trade-offs, bottlenecks, distributed systems principles).
*   *Example:* Before writing the API endpoint for the tracking pixel, explain HTTP, DNS, TCP handshakes, and the economics of Serverless compute models versus provisioned instances.
*   *Example:* Before writing the Supabase schema, explain ACID vs. BASE properties, and why a relational DB is chosen over the user's familiar MongoDB for this use case.

## 📝 Documenting Progress
*   Please keep `task.md` (or the equivalent checklist) updated as you complete tasks.
*   Ensure that you are teaching the concepts listed in the architectural decisions above.
