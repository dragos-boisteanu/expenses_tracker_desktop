import { Database } from 'better-sqlite3'
import migrations from '../migrations/migrations.js'

export default  (db: Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      applied_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const appliedRows = db.prepare('SELECT name FROM migrations').all()
  const appliedMigrations = new Set(appliedRows.map((row: any) => row.name))
  const migrationsToRun = migrations.filter((m) => !appliedMigrations.has(m.name))

  if (migrationsToRun.length > 0) {
    const transaction = db.transaction((migs) => {
      for (const m of migs) {
        m.up(db)
        db.prepare('INSERT INTO migrations(name) VALUES (?)').run(m.name)
        console.log(`Applied migration: ${m.name}`)
      }
    })

    transaction(migrationsToRun)
  }
}
