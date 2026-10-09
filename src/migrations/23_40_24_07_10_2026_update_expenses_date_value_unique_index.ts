import { Database } from 'better-sqlite3'

export default (db: Database) => {
  db.exec(`
    DROP INDEX IF EXISTS unique_expense;
    CREATE UNIQUE INDEX IF NOT EXISTS unique_expense ON expenses (date, value);
  `)
}
