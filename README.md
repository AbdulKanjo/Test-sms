# SMS Project

This repository contains a sample SMS-based project that demonstrates a full stack architecture built with modern technologies. The goal is to provide an end-to-end example of sending and receiving SMS messages.

## Project Goals

- Provide an example SMS application.
- Demonstrate Next.js and NestJS integration with Supabase, Redis, and Twilio.
- Show how to run separate frontend, backend, and worker processes.

## Stack

- **Next.js** – Frontend user interface
- **NestJS** – Backend API
- **Supabase** – Database and authentication
- **Redis** – Message queue and caching
- **Twilio** – SMS provider

## Architecture Overview

The application is split into three main parts:

1. **Frontend (Next.js)** – Provides the web interface for users.
2. **Backend (NestJS)** – REST API that communicates with Supabase for data storage and Twilio for SMS operations.
3. **Worker** – Background process that handles SMS events and utilizes Redis for queuing.

## Local Development

1. **Install Node.js** – Ensure you have Node.js 18+ installed. You can download it from [nodejs.org](https://nodejs.org/).
2. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Test-sms
   ```
3. **Environment variables** – Copy the provided `.env.example` (if available) to `.env` and update credentials for Supabase, Redis, and Twilio.
4. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Frontend

```bash
npm run dev:frontend
```

### Running the Backend

```bash
npm run dev:backend
```

### Running the Worker

```bash
npm run dev:worker
```

Each command should be run in a separate terminal. The frontend, backend, and worker processes will interact via environment variables and the configured services.

