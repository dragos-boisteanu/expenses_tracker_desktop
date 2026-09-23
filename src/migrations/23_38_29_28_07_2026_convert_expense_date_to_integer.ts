import { Database } from 'better-sqlite3'

export default (db: Database) => {
  // Wrap in a transaction to guarantee atomicity and avoid data corruption
  const runMigration = db.transaction(() => {
    db.exec(`
    CREATE TABLE expenses_dg_tmp (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      value       INTEGER NOT NULL,
      currency    TEXT,
      date        INTEGER NOT NULL DEFAULT (unixepoch()),
      description TEXT,
      updated_at  INTEGER,
      created_at  INTEGER DEFAULT (unixepoch())
    );

    INSERT INTO expenses_dg_tmp (id, value, currency, date, description, updated_at, created_at)
    SELECT
      id,
      value,
      currency,
      COALESCE(
        CASE
          -- If date is already an integer in SQLite, use it directly (skip conversion)
          WHEN typeof(date) = 'integer' THEN date

          -- If it's an ISO timestamp string, convert using unixepoch()
          WHEN date GLOB '*[a-zA-Z-]*' THEN unixepoch(date)

          -- If it's already a numeric timestamp (even stringified), CAST it
          WHEN CAST(date AS INTEGER) > 0 THEN CAST(date AS INTEGER)
          ELSE NULL
        END,
        unixepoch() -- Fallback to current Unix epoch timestamp if NULL or empty
      ) AS date,
      description,
      updated_at,
      created_at
    FROM expenses;

    DROP TABLE expenses;

    ALTER TABLE expenses_dg_tmp RENAME TO expenses;

    CREATE UNIQUE INDEX IF NOT EXISTS unique_expense
      ON expenses (value, currency, date);
  `)
  })

  runMigration()
}
