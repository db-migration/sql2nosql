# sql2nosql

Analyze PostgreSQL schemas and generate NoSQL (MongoDB) design and migration scripts.

## Quick start

1. **Analyze** your Postgres schema:
   ```bash
   yarn analyze
   # or: npx sql2nosql analyze
   ```
2. **Run migrations** (Postgres → MongoDB):
   ```bash
   cd packages/cli && node output/scripts/run-all.migrate.js
   ```

## Documentation

- [Run migrations](/run-migrations) — How to run migration scripts with Node
- [Generator checklist](/generator-checklist) — Migration script generator options and config

## Links

- [GitHub](https://github.com/data-migration/sql2nosql)
- Config: `sql2nosql.config.json` at project root
