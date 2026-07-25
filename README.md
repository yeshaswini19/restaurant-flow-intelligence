# Restaurant Flow Intelligence

A real-time restaurant intelligence platform that uses an event-driven architecture to compute dish availability from inventory instead of manually toggling menu items.

## ✨ Core Idea

Inventory is the single source of truth.

Every order updates the ingredient ledger.

Recipe dependencies determine dish availability automatically.

The same computed state is propagated in real time to customers, kitchen staff, restaurant staff, and managers.

AI is used only to explain predictions in natural language—it never performs business logic.

## 🚀 Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express
- TypeScript

### Database
- Supabase PostgreSQL

### Realtime
- Supabase Realtime

### Authentication
- Supabase Auth
- Google OAuth
- Email OTP

### AI
- Groq API

## 📂 Repository Structure

```
restaurant-flow-intelligence/
├── client/
├── server/
├── database/
├── docs/
└── .github/
```

## 📌 Project Status

🚧 Currently under active development.