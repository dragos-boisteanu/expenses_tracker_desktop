import { Database } from 'better-sqlite3'

export default (db: Database) => {
  const migrate = db.transaction(() => {
    // 1. Create a new temporary table with the updated schema
    db.prepare(
      `
      CREATE TABLE expenses_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value REAL,
        currency TEXT,
        date TEXT,
        description TEXT,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER
      )
    `,
    ).run()

    // 2. Copy all existing data from the old table to the new table
    // (If existing rows don't have a created_at, they will copy as NULL.
    // If you want them to backfill with the current time, replace 'created_at'
    // in the SELECT with 'COALESCE(created_at, unixepoch())')
    db.prepare(
      `
      INSERT INTO expenses_new (id, value, currency, date, description, created_at, updated_at)
      SELECT id, value, currency, date, description, created_at, updated_at
      FROM expenses
    `,
    ).run()

    // 3. Drop the old table
    db.prepare(
      `
      DROP TABLE expenses
    `,
    ).run()

    // 4. Rename the new table to the original name
    db.prepare(
      `
      ALTER TABLE expenses_new RENAME TO expenses
    `,
    ).run()

    // 5. (Optional) Recreate any indexes you had on the original 'expenses' table here
    // db.prepare(`CREATE INDEX idx_expenses_date ON expenses(date)`).run();
  })

  migrate()
}
