# jen-ventory-client

> React frontend for Jenventory — an inventory, POS, and debt tracking system built for small sari-sari store owners.

## The Story Behind It

My sister runs a small sari-sari store, and whenever I helped out I kept running into the same frustrations: product prices weren't easy to look up on the fly, and whenever a customer owed money (utang), tracking it meant digging through a handwritten notebook trying to find their name.

Jenventory is the solution I built for her. This is the frontend — a clean dashboard where she can manage her products, ring up sales, and keep a proper record of customers who owe her money, all without touching a notebook.

## What It Does

- **Dashboard** — at-a-glance overview of inventory status, recent sales, and outstanding debts
- **Inventory Management** — view, add, edit, and track products with live stock levels and prices
- **Point of Sale** — a simple POS interface to process sales and auto-update stock
- **Debt Tracker** — add debtors, log what they owe, and track repayments over time
- **Reports & Charts** — visual summaries of sales and debts using shadcn/ui charts

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Routing | TanStack Router |
| Server State | TanStack Query |
| Client State | Zustand |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Charts | shadcn/ui Charts (Recharts-based) |
| Linting / Format | ESLint + Prettier |

## Getting Started

### Prerequisites

- Node.js 18+
- The [jen-ventory-api](https://github.com/Cedrickkk/jen-ventory-api) backend running locally

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Cedrickkk/jen-ventory-client.git
   cd jen-ventory-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables (copy from the provided example):
   ```bash
   cp .env.example .env
   ```
   Then fill in your API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
├── features/         # Feature-based modules (inventory, POS, debts)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── provider/         # App-level providers (theme, query client)
├── routes/           # TanStack Router route definitions
├── stores/           # Zustand state slices
├── index.css         # Global styles
├── main.tsx          # App entry point
└── routeTree.gen.ts  # Auto-generated route tree (TanStack Router)
```

## What I'd Do Differently

This was a project built out of a real need for someone I care about, and it works. But looking back:

**Add proper testing from the start.** There are no component tests or integration tests in this codebase. I relied entirely on manual testing while building, which made it hard to catch regressions as features grew. I'd add Vitest and React Testing Library from the beginning — at least testing the core flows like the POS and debt tracker.

**Build the UI/UX with more intention upfront.** I mostly designed as I went, which led to some inconsistencies in the layout and flow. Since this is meant for a real user doing real daily tasks, I should have mapped out the key workflows (checking debts, processing a sale) before writing any components — even a rough paper sketch would have saved time.

## Related

Backend (Spring Boot API): [jen-ventory-api](https://github.com/Cedrickkk/jen-ventory-api)

> **Note:** Deployment is planned but not yet live. Setup instructions above are for local development.
