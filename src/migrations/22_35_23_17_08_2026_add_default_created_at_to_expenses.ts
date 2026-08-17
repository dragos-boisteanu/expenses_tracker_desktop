import { Database } from 'better-sqlite3'

export default (db: Database) => {
  // Use a transaction to ensure all steps succeed or roll back entirely
  db.transaction(() => {
    // 1. Create a new temporary table with the updated default constraint
    db.prepare(
      `
      CREATE TABLE expenses_temp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT,
        currency TEXT,
        date INTEGER,
        description TEXT,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER
      )
    `,
    ).run()

    // 2. Copy existing data from the old table to the new one
    db.prepare(
      `
      INSERT INTO expenses_temp (id, value, currency, date, description, created_at, updated_at)
      SELECT id, value, currency, date, description, created_at, updated_at
      FROM expenses
    `,
    ).run()

    // 3. Drop the old table
    db.prepare(`DROP TABLE expenses`).run()

    // 4. Rename the new table to the original name
    db.prepare(`ALTER TABLE expenses_temp RENAME TO expenses`).run()
  })()
}
