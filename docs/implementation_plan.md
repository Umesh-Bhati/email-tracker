# Implementation Plan: Email Tracker App

This document outlines the step-by-step implementation process for our Streak-like email tracking application.

## Proposed Changes

### 1. Database & Backend Setup
We will initialize a new Next.js project to serve as the Backend API and connect it to a Supabase PostgreSQL instance.

#### [NEW] `backend/` (Next.js Project)
- `src/app/api/track/[id]/route.ts`: Endpoint that returns a 1x1 transparent GIF and records an `OPEN` event in Supabase.
- `src/app/api/click/[id]/route.ts`: Endpoint that records a `CLICK` event and redirects the user (`302 Found`) to the original URL.
- `src/app/api/emails/route.ts`: Endpoint for the Chrome extension to register a newly sent email.
- `src/lib/supabase.ts`: Database connection client.

### 2. Chrome Extension (Frontend)
We will create a React + Vite application configured as a Chrome Extension (Manifest V3).

#### [NEW] `extension/` (Vite + CRXjs Project)
- `manifest.json`: Defines permissions (`activeTab`, `storage`, `scripting`, `host_permissions` for `mail.google.com`).
- `src/content-scripts/gmail.tsx`: Injects a React tracking toggle into the Gmail compose box. It listens for the "Send" button click to append the hidden tracking pixel `<img>`.
- `src/background/service-worker.ts`: Handles background network requests and authenticates the user.
- `src/popup/Popup.tsx`: A lightweight CRM dashboard showing the user which emails were opened recently.

## Verification Plan

### Automated Tests
- We will write basic API endpoint tests in Next.js using `jest` to verify:
  - `GET /api/track/[id]` returns a strictly 1x1 transparent base64 image and a 200 OK status.
  - `GET /api/click/[id]?url=...` correctly returns a 302 Redirect.
  - Database schemas accept insertion properly.

### Manual Verification
1. **Load Unpacked Extension**: We will instruct the user to load the `extension/dist` folder via `chrome://extensions`.
2. **Gmail Compose**: The user will open Gmail, click "Compose", and verify the "Track this email" UI toggle appears.
3. **Send Email**: The user will turn the toggle on, send a test email to their own secondary account.
4. **Trigger Open**: The user will open the email in their secondary account.
5. **Verify DB**: We will check the Supabase logs/dashboard to confirm an `OPEN` event was registered.
6. **Verify UI**: The user will check the Extension popup to see the real-time "Opened" status.
