import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import Database from 'better-sqlite3'
import { Expense } from '@/types/expense'

const isDev = process.env.npm_lifecycle_event === 'desktop:dev'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dbPath = path.join(app.getPath('userData'), 'expenses.db')

if (isDev) {
  dbPath = 'expenses.db'
}

console.log('dbPath', dbPath)
const db = new Database(dbPath, {})
db.pragma('journal_mode = WAL')

db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY,
      value  REAL NOT NULL,
      currency TEXT,
      date TEXT NOT NULL
    )
`)
let mainWindow: BrowserWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 624,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
    },
  })

  // and load the index.html of the app.

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173/') // Open the DevTools.
  } else {
    mainWindow.loadFile(join(__dirname, '../index.html'))
  }

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('closeApp', () => {
    mainWindow.close()
  })
})

ipcMain.handle('insertExpense', (event, expense: Expense) => {
  const insertExpenseStatement = db.prepare(
    'INSERT INTO expenses (value, currency, date) VALUES (@value, @currency, @date)',
  )
  const result = insertExpenseStatement.run({
    value: expense.value,
    currency: expense.currency,
    date: expense.date,
  })

  return result.lastInsertRowid
})

ipcMain.handle('deleteExpense', (event, expenseId: string) => {
  const deleteExpenseStatement = db.prepare('DELETE FROM expenses WHERE id = @id')

  const result = deleteExpenseStatement.run({ id: expenseId })

  return result.changes
})

ipcMain.handle('getExpenses', () => {
  const getExpensesListStatement = db.prepare('SELECT * FROM expenses ORDER BY expenses.date DESC')
  return getExpensesListStatement.all()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
