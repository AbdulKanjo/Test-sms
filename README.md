# Test SMS

This project demonstrates a simple NestJS service for sending SMS messages using Twilio. Messages are persisted using TypeORM.

## Environment Variables

Set the following variables in your environment:

- `TWILIO_ACCOUNT_SID` – your Twilio account SID
- `TWILIO_AUTH_TOKEN` – your Twilio auth token
- `TWILIO_PHONE_NUMBER` – the Twilio phone number that will send messages

A local SQLite database (`db.sqlite`) is used by default.
