# SUBTEXT reader community

The magazine remains at https://tfpfilmclub.github.io/subtext/. Its shared reactions and guest comments use a separate Sites service at https://subtext-reader-community.coolgull21.chatgpt.site with Cloudflare D1. No reader account or GitHub login is required.

The owner manages comments at https://subtext-reader-community.coolgull21.chatgpt.site/moderation using Sign in with ChatGPT. Access is checked against the server-side `OWNER_ID`. This owner login is not part of the reader flow.

## Data and behavior

- One Like or Love per anonymous browser session per article. A reader can switch or remove their reaction. Session tokens are signed server-side and retained in browser storage; clearing browser storage creates a new anonymous identity.
- Comments store the supplied display name, text, article, date and anonymous author ID. Names are reader-supplied and not verified. Email addresses are not requested.
- A reader can delete their own comment. Owners can delete any comment from the moderation page. Three distinct reports hide a comment from public view for owner review.
- Writes require a signed anonymous session, allowed origin and bounded request body. Server-side validation, an invisible honeypot and rate limits reduce casual abuse. Reaction uniqueness is enforced by the database.
- Rate-limit keys use a keyed hash of the connecting address; raw IP addresses are not stored in the application database. Rate buckets older than 48 hours are pruned.
- Counts are read from the server, never fabricated or initialized with sample activity. Connection failures leave controls unavailable with a retry option.
- Article views are shared server counts, starting from this feature's launch. An article opened in a visible browser tab registers a view; the same anonymous browser counts once per article per 30-minute window. Background tabs, previews and reads of the counter endpoint do not increment it. Clearing browser storage creates a new anonymous identity.
- View registration atomically updates the aggregate and its deduplication record. Deduplication records older than 24 hours are pruned while lifetime totals remain. No reader names, emails or raw IP addresses are stored with views. The counter stays hidden when its service is unavailable.

## Source and publication

Canonical authored files and immutable Drizzle migrations are retained in this directory. The Sites source repository contains the complete Vinext starter, lockfile and build integration. `.openai/hosting.json` preserves the exact provisioned project ID.

`node scripts/sync-community.mjs` copies the authored files into the isolated ignored checkout at `tmp/community-site`. Use the Sites skill to reopen/recover that checkout if missing, install its locked dependencies, append schema migrations with `npm run db:generate`, and publish with the supported source workflow. Preserve the `sites()` Vite integration and applied migrations. Copy newly generated migration files and metadata back into this directory.

Runtime keys are configured through Sites environment settings: `SESSION_SECRET`, `OWNER_ID`, `PREVIEW_ORIGINS`. Secret values are not in Git, HTML or browser bundles. Do not rotate `SESSION_SECRET` during routine publication; it would invalidate reader sessions.

The frontend origin is configured in `public/community-config.js`. Add new article slugs to the server's `STORIES` whitelist when publishing new content. Author profiles and reading estimates are generated from `public/data.js` automatically.

`node scripts/check-community.mjs` uses an isolated in-memory SQLite database to check shared counts, idempotent reactions, comments, input validation, origin checks, signed sessions, reports and deletion permissions. Production connectivity was also checked while the service was private; test comments and reactions were cleared before it was opened to readers.
