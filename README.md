# SMS Campaign Worker

This project demonstrates a BullMQ worker that schedules SMS campaigns stored in a SQLite database.

## Usage

1. Install dependencies:

```bash
npm install
```

2. Start the worker:

```bash
npm start
```

The worker periodically checks for pending messages to send, schedules messages based on campaign definitions, and runs a daily job to remind users of unused coupons older than three days.
