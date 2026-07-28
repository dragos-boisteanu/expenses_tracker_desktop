import { Database } from 'better-sqlite3'

export default (db: Database) => {
  db.exec(`
    CREATE TABLE expenses_dg_tmp (
      id          INTEGER PRIMARY KEY,
      value       INTEGER NOT NULL,
      currency    TEXT,
      date        INTEGER NOT NULL,
      description TEXT,
      updated_at  INTEGER,
      created_at  INTEGER
    );

    INSERT INTO expenses_dg_tmp (id, value, currency, date, description, updated_at, created_at)
    SELECT
      id,
      value,
      currency,
      CAST(date AS INTEGER),
      description,
      updated_at,
      created_at
    FROM expenses;

    DROP TABLE expenses;

    ALTER TABLE expenses_dg_tmp RENAME TO expenses;

    CREATE UNIQUE INDEX IF NOT EXISTS expense_id
      ON expenses (id);

    CREATE UNIQUE INDEX IF NOT EXISTS unique_expense
      ON expenses (value, currency, date);
  `)
}
