import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import Database from 'better-sqlite3'
import { Expense } from '../types/expense.js'
import electronUpdater, { type AppUpdater } from 'electron-updater'
import { CsvService } from '../services/csvService.js'
import fsp from 'fs/promises'

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

ipcMain.handle('getExpenses', (event, payload) => {
  const getExpensesListStatement = db.prepare(
    'SELECT * FROM expenses ORDER BY expenses.date DESC LIMIT @limit OFFSET @offset',
  )
  return getExpensesListStatement.all({
    offset: payload.offset,
    limit: payload.limit,
  })
})

ipcMain.handle('exportExpenses', async (event, fileName) => {
  try {
    const getExpensesListStatement = db.prepare(
      'SELECT * FROM expenses ORDER BY expenses.date DESC',
    )
    const expenses = getExpensesListStatement.all() as Expense[]

    const csvService = new CsvService()
    const csvBlob = csvService.export<Expense>(expenses)
    const buffer = await csvBlob.arrayBuffer()
    await saveFile({
      fileName,
      buffer: Buffer.from(buffer),
      increment: 0,
    })
  } catch (error) {
    console.error('exportExpensesError', error)
  }
})

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
    await fsp.writeFile(`${filePath}`, data.buffer, { flag: 'wx' })
    console.log('File written successfully\n')
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log('fileAlready exists')
      data.increment++
      await saveFile(data)
    } else {
      console.log('failed to write file to disk', JSON.stringify(err))
    }
  }
}
