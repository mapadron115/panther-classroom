# Panther Classroom

An interactive Canvas-inspired student showcase for **Mateo Padron**, with four fully asynchronous philosophy courses for Fall C 2026. No live meetings or Zoom sessions are required.

## Courses

| Course | Code | Illustrative faculty reference |
| --- | --- | --- |
| Ethics | PHI 3601 | Timothy Aylsworth |
| Epistemology | PHI 3300 | Kenton Harris |
| Philosophy of Death | PHM 4050 | Céline Leboeuf |
| Medieval Philosophy | PHH 3200 | Kenton Harris |

Course numbers use FIU public catalog references. Faculty associations use public historical teaching references, including faculty pages and Rate My Professors. These are not verified Fall 2026 online section assignments. Enrollment, grades, schedules, syllabi, feedback, classmates, and messages are fictional showcase content. The site is not affiliated with FIU or Instructure.

## Features

- Student dashboard, course navigation, profile, inbox, calendar, and activity history.
- Four full 16-week syllabi and 112 assignments, with graded work through October 6, 2026.
- Required readings, linked assigned videos, reading guides, and completion tasks.
- Text and file submissions, concept checks, discussion replies, grade exports, and What-if calculations.
- Persistent structured data in Cloudflare D1 and attachments in R2.

## Development

Requires Node.js 22.13+ and pnpm. Run `pnpm install`, then `pnpm dev`. Run `pnpm build` to create the Cloudflare Worker and client assets. Deployment through Sites uses the provided site workflow. The `.openai/hosting.json` file retains the existing site identity and logical DB/BUCKET bindings.

For standalone Cloudflare deployment, configure a D1 database and R2 bucket, preserve the DB and BUCKET binding names, apply the SQL migration in `drizzle/`, and deploy the generated Worker output. GitHub Pages alone cannot run the server API or persistent storage.

## Source layout

- `app/page.tsx`: student interface and interactions.
- `app/globals.css`: responsive Canvas-inspired styling.
- `lib/courses.ts`: courses, modules, readings, videos, assignments, grades, and references.
- `app/api/state/route.ts`: saved records.
- `app/api/files/route.ts`: file upload and download.
- `db/schema.ts`, `db/storage.ts`, `drizzle/`: storage schema and migrations.

## Validation

TypeScript and production build checks pass. Course data validation covers unique assignment IDs, term dates, past/future grade status, score ranges, and weighted totals. Runtime checks verified the dashboard response, saved submissions/messages/discussions/events, file upload/download, submission updates, event deletion, and invalid request handling.
