import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import Database from 'better-sqlite3'
import { Expense } from '../types/expense.js'
import electronUpdater, { type AppUpdater } from 'electron-updater'
import { CsvService } from '../services/csvService.js'
import fsp from 'fs/promises'
import { ImportedExpense } from '@/types/importedExpense'
import { DbImportResult } from '@/types/dbImportResult'
import sleep from '../helpers/sleep.js'

const isDev = process.env.npm_lifecycle_event === 'desktop:dev'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dbPath = path.join(app.getPath('userData'), 'expenses.db')

if (isDev) {
  dbPath = 'expenses.db'
}

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

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS  unique_expense ON expenses (value, currency, date);
`)

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS  expense_id ON expenses (id);
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
    mainWindow.loadURL('http://localhost:5173/')
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

export function getAutoUpdater(): AppUpdater {
  const { autoUpdater } = electronUpdater
  return autoUpdater
}

app.whenReady().then(() => {
  createWindow()

  if (!isDev) {
    const autoUpdater = getAutoUpdater()

    autoUpdater.on('checking-for-update', () => console.log('checking for update'))
    autoUpdater.on('update-available', () => console.log('update available'))
    autoUpdater.on('update-not-available', () => console.log('update not available'))
    autoUpdater.on('update-downloaded', () => console.log('update downloaded'))

    autoUpdater.checkForUpdates().catch((error) => console.log('error', error))

    setInterval(
      () => autoUpdater.checkForUpdates().catch((error) => console.log('error', error)),
      60 * 60000,
    )
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('closeApp', () => {
    mainWindow.close()
  })
  ipcMain.on('minimizeApp', () => {
    mainWindow.minimize()
  })
})

ipcMain.on('setLaunchAtSystemStartup', (event, payload: boolean) => {
  app.setLoginItemSettings({
    openAtLogin: payload,
  })
})

ipcMain.handle('getLaunchAtSystemStartup', () => {
  const login = app.getLoginItemSettings()
  return login.openAtLogin
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

ipcMain.handle('deleteExpense', (event, expenseId: number) => {
  const deleteExpenseStatement = db.prepare('DELETE FROM expenses WHERE id = @id')

  const result = deleteExpenseStatement.run({ id: expenseId })

  return result.changes
})

ipcMain.handle('deleteAllData', async () => {
  const deleteExpenseStatement = db.prepare('DELETE FROM expenses')

  const result = deleteExpenseStatement.run()
  await sleep(5000)

  return result.changes
})

ipcMain.handle('getExpenses', (event, payload) => {
  const getExpensesListStatement = db.prepare(
    'SELECT * FROM expenses ORDER BY expenses.date DESC LIMIT @limit OFFSET @offset',
  )
  return getExpensesListStatement.all({
    offset: payload.offset,
    limit: payload.limit,
  })
})

ipcMain.handle('exportExpenses', async (event, fileName: string) => {
  try {
    const getExpensesListStatement = db.prepare('SELECT value, currency, date FROM expenses')
    const expenses = getExpensesListStatement.all() as Expense[]

    const csvService = new CsvService()
    const csvBlob = await csvService.export(expenses)

    const csvArrayBuffer = await csvBlob.arrayBuffer()
    const buffer = Buffer.from(csvArrayBuffer)

    await saveFile({
      fileName,
      buffer,
      increment: 0,
    })

    await sleep(5000)
  } catch (error) {
    console.error('exportExpensesError', error)
  }
})

ipcMain.handle(
  'importExpenses',
  async (event, expenses: ImportedExpense[]): Promise<DbImportResult> => {
    let duplicates = 0
    const errors = []

    const insert = db.prepare(
      'INSERT INTO expenses (value, currency, date) VALUES(@value, @currency, @date)',
    )
    const transaction = db.transaction((expenses: ImportedExpense[]) => {
      return expenses
        .map((expense) => {
          try {
            const result = insert.run({
              value: expense.value,
              currency: expense.currency,
              date: expense.date,
            })

            return { ...expense, id: result.lastInsertRowid as number }
          } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
              duplicates++
            } else {
              errors.push(error.code)
            }
          }
        })
        .filter((expense) => !!expense)
    })

    const result = transaction(expenses) as Expense[]

    await sleep(5000)

    console.log('result', {
      inserted: result,
      duplicates,
      errors,
    })
    return {
      inserted: result,
      duplicates,
      errors,
    }
  },
)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const saveFile = async (data: { fileName: string; buffer: Buffer; increment: number }) => {
  const fileNameWithoutExtension = path.parse(data.fileName).name
  const extension = path.parse(data.fileName).ext

  let fileName = ''
  let filePath = ''

  fileName = `${fileNameWithoutExtension}${
    data.increment > 0 ? `(${data.increment})` : ''
  }${extension}`
  filePath = `${app.getPath('downloads')}/${fileName}`
  try {
    console.log('filePath', filePath)
    await fsp.writeFile(filePath, data.buffer, { flag: 'wx' })
  } catch (err) {
    if (err.code === 'EEXIST') {
      data.increment++
      await saveFile(data)
    } else {
      console.error('failed to write file to disk', JSON.stringify(err))
    }
  }
}
