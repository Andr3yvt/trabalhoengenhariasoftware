# AGENTS.md — Andrey Project

Portuguese (pt-BR) accessibility questionnaire + private admin panel. TanStack Start (React 19) on Netlify, Netlify Database (Postgres via Drizzle), Netlify Identity.

## Layout

- `src/lib/questions.ts` — **single source of truth** for the 15 questions (ids `q1`…`q15`, type, options, required flag) and `validateSubmission`, the server-side runtime validator. UI, server, admin view and CSV all read from it. Keep exactly 7 `choice` + 8 `open` questions; `q15` must stay last.
- `src/components/Survey.tsx` — the whole participant flow as a client-side state machine (`welcome → identify → question[i] → review → thanks`). Draft is kept in `sessionStorage` (`andrey-project:rascunho`) only; nothing is persisted server-side until "Enviar respostas".
- `src/lib/survey.functions.ts` — public `submitParticipation` server fn (POST, validated).
- `src/lib/admin.functions.ts` — `getAdminSession`, `listParticipations`, `exportParticipationsCsv`. Every data function uses the `requireAdmin` middleware (Identity user with `admin` in `app_metadata.roles`). Never add an admin data function without it.
- `src/routes/admin.tsx` — login / invite-accept / password-recovery / dashboard. Not linked from the public site; `noindex`.
- `src/routes/index.tsx` — mounts the survey and forwards Identity email hashes (`#invite_token=` etc.) to `/admin`.
- `src/components/AdminDashboard.tsx` — filters (date range in America/Sao_Paulo, nickname search), table, `<dialog>` detail, CSV download.
- `db/schema.ts`, `db/index.ts`, `drizzle.config.ts`, migrations in `netlify/database/migrations/`.

## Conventions

- All user-facing copy is pt-BR; the questionnaire copy comes verbatim from the product brief — don't reword it.
- Palette tokens live in `src/styles.css` `@theme` (`navy`, `sky`, `ink`, `mist`, `mint`, …) plus `.btn-primary`, `.btn-secondary`, `.field`.
- Accessibility is a product requirement: every input labelled, errors use `role="alert"` + text/icon (never color alone), each screen focuses its `h1` on navigation, selected options show a check and "Selecionada".
- Schema changes: edit `db/schema.ts`, then `npx drizzle-kit generate --name <verb_description>`. Never edit applied migrations.
- Multiple-choice questions always require a selection (including the light personal one, q3); open personal questions are optional.

## Non-obvious decisions

- Answers are stored as a JSONB map instead of 15 columns so the question list can evolve without migrations; the admin UI and CSV map ids back to titles.
- CSV cells are quoted and prefixed with `'` when starting with `= + - @` to prevent spreadsheet formula injection; a UTF-8 BOM is added for Excel.
- The admin role must be assigned manually in the Netlify Identity UI (see README).
