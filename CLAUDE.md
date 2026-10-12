# CLAUDE.md

## Project overview

We're building a prototype of a transaction categorization system.

The main parts we need to build are data storage for various transaction information, and a UX that allows users to review and modify it.

## Potential TODOs

- Recurring transactions - how to detect, how to handle (auto-approve? allow bulk approval without selecting manually?)

## Repo layout

- `bridger-agent/`: Next.js app (GraphQL backend, database, UI)
- `langgraph-server/`: Python LangGraph API server

- Run web app: `cd bridger-agent && npm run dev` (http://localhost:3000; GraphiQL at http://localhost:3000/api/graphql)
- Run LangGraph server: `source .venv/bin/activate && cd langgraph-server && fastapi dev agent.py` (http://localhost:8000; requires `ANTHROPIC_API_KEY` in the environment)
- Run tests: no test suite yet; lint with `cd bridger-agent && npm run lint`
- Database / ORM: `Prisma` (SQLite at `bridger-agent/prisma/dev.db`); migrations: `cd bridger-agent && npm run prisma:migrate:dev`; UI over the DB: `cd bridger-agent && npm run prisma:studio`

## Code style

- **Favor readability over brevity.** Prefer clear names, explicit steps, and simple control flow over clever one-liners, dense chains, or nested ternaries. A few extra lines are fine if they make the code easier to follow.
- Each function should have at least a top-level component explaining what it does, unless it's very short and extremely obvious. If a function does something non-trivial, it should have inline comments as well.

## React

- **Break UI into small, focused components.** Never dump a large block of JSX into a single component. If a component renders more than one distinct piece of UI (a table row, a form, a status badge, a list item), extract each into its own component.
- Rule of thumb: if a component is longer than ~60 lines or mixes data fetching with layout, split it.
- Separate concerns: data fetching and state live in containers or hooks; presentational components receive props and render.
- Extract reusable logic into custom hooks.
- One component per file, named after the component, with explicitly typed props.

## Architecture conventions

TODO

## Working with me

- Before building something non-trivial, state your plan in a few sentences and wait for confirmation if the approach is ambiguous.
- Build thin end-to-end slices first, then deepen them. Prefer lean code that runs over large unfinished scaffolding.
- Run the relevant tests or the app after changes and report what you verified. Do not claim something works without running it, with the exception of extremely minor or straightforward refactors.
- When you make a tradeoff or assumption, call it out briefly in your summary.
- Keep changes minimal and scoped to the request. Do not refactor unrelated code.
