## Project Context

**Goal:**  
Analyze SQL databases, generate explainable NoSQL schema designs, and produce runnable migration scripts (Postgres → MongoDB). Provide docs and a docs site.

**Current scope:**
- **Analyze** — Connect to Postgres, introspect schema, build SQL/NoSQL models, optional LLM recommendations; output JSON + HTML view
- **Generate** — Per-table migration scripts (packages/cli/output/scripts/*.migrate.js) and run-all.migrate.js; config-driven (batch, dry-run, indexes, composite PK)
- **Run migrations** — User runs `node output/scripts/run-all.migrate.js` (or single script) from packages/cli; scripts read sql2nosql.config.json at project root
- **Docs** — Repo root **content/** (markdown); **docs-site** (VitePress) serves it; one `yarn install` at root installs all workspaces including docs-site

**Supported DBs:**  
- PostgreSQL (source); MongoDB (target for generated scripts)

**Repo structure:**  
- Monorepo: workspaces = `packages/*` + `docs-site`  
- Config: sql2nosql.config.json at project root (connection, schema, mongodb, migration options)  
- Content: content/ (single source for docs); docs-site uses srcDir: '../content'

**Non-goals:**  
- Fully automated data migration (user runs scripts)  
- Rollback or sync  
- Hosted UI (local only)
