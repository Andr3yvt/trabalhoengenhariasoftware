# AGENTS.md — Andrey Project

Portuguese (pt-BR) accessibility questionnaire + private admin panel. TanStack Start (React 19) on Netlify, Netlify Database (Postgres via Drizzle), Netlify Identity.

## Layout

- `src/lib/questions.ts` — **single source of truth** for the 25 current questions (ids `q1`…`q25`, category, type, options, required flag), the read-only `LEGACY_QUESTIONS_V1` (original 15, for old rows), `questionsForVersion` and `validateSubmission`, the server-side runtime validator. UI, server, admin view and CSV all read from it. Order is fixed by the brief; accessibility questions (incl. open q24) are required, all others optional.
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
- Required = category `acessibilidade`; personal (`pessoal`), `flerte` (q18) and `especial` (q25) are optional.
- The thanks screen shows the project owner's WhatsApp (wa.me/5545988428151). Never add a field asking for the participant's phone.

## Non-obvious decisions

- Rows carry `questionnaire_version` (1 = original 15 questions, default for pre-update rows; 2 = current 25). Admin UI/CSV pick the question set per row. Bump `CURRENT_VERSION` if question meanings change; the draft key in `Survey.tsx` is versioned too.
- Answers are stored as a JSONB map instead of one column per question so the question list can evolve without migrations; the admin UI and CSV map ids back to titles.
- CSV cells are quoted and prefixed with `'` when starting with `= + - @` to prevent spreadsheet formula injection; a UTF-8 BOM is added for Excel.
- The admin role must be assigned manually in the Netlify Identity UI (see README).
