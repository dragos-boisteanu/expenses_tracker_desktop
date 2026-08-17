import { Database } from 'better-sqlite3'

export default (db: Database) => {
  db.exec(`
    CREATE TRIGGER expenses_updated_at
    AFTER UPDATE ON expenses
    FOR EACH ROW
    BEGIN
      UPDATE expenses
      SET updated_at = unixepoch()
      WHERE id = NEW.id;
    END
  `)
}
