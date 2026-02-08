# Run migrations (Postgres → MongoDB)

Migration scripts are generated under `packages/cli/output/scripts/` when you run `sql2nosql analyze`. That folder is regenerated on each analyze.

## Run all migrations with Node

From **`packages/cli`**:

```bash
cd packages/cli
yarn install   # or npm install (ensures pg + mongodb are installed)
node output/scripts/run-all.migrate.js
```

From **project root**:

```bash
node packages/cli/output/scripts/run-all.migrate.js
```

`run-all.migrate.js` runs every collection migration in dependency order (e.g. artist → album → …) and prints `✓ All migrations completed.` when done.

## Requirements

- **Config:** `sql2nosql.config.json` at the **project root** with `connection`, `schema`, and `mongodb.uri` / `mongodb.database`.
- **Dependencies:** `pg` and `mongodb` (installed in `packages/cli` when you run `yarn install` there).

## Dry run (no writes)

In `sql2nosql.config.json` set:

```json
"migration": { "dryRun": true }
```

Then run the same command; scripts will connect and process rows but not write to MongoDB.

## Run a single collection

```bash
cd packages/cli
node output/scripts/album.migrate.js
```

Run dependency collections first (e.g. `artist.migrate.js` before `album.migrate.js`) if you don’t use run-all.
