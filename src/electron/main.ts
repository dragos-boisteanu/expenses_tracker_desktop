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
import { Notification } from '@/types/notification'

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

db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      read INTEGER CHECK(read IN (0, 1)) NOT NULL default 0,
      type TEXT CHECK(type IN ('data', 'update')) NOT NULL,
      error INTEGER CHECK(error IN (0, 1)) NOT NULL default 0,
      created_at TEXT NOT NULL
    )
`)
db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS  notification_id ON notifications (id);
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
    // mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../index.html'))
  }

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('ready-to-show', () => {
    sendLogToRender('readyToShow', 'log')
    // sendLogToRender('readyToShow', 'error')
  })
}

export function getAutoUpdater(): AppUpdater {
  const { autoUpdater } = electronUpdater
  return autoUpdater
}

const autoUpdater = getAutoUpdater()
let manualCheckForUpdate = false
let autoCheckFoUpdateInterval = null
const AUTO_UPDATE_CHECK_TIME = 60 * 60000

app.whenReady().then(() => {
  createWindow()

  if (!isDev) {
    autoUpdater.autoDownload = false

    autoUpdater.on('checking-for-update', () => {
      console.log('checking for update')
      sendLogToRender('checking for update', 'log')
    })
    autoUpdater.on('update-available', (event) => {
      console.log('update available')

      if (manualCheckForUpdate) {
        const version = event.version
        const releaseDate = event.releaseDate
        const releaseNote = event.releaseNotes

        const notification: Notification = {
          title: `New update available v${version} from ${formatDate(releaseDate)}`,
          content: releaseNote.toString(),
          type: 'update',
          read: 0,
          isError: false,
          createdAt: Math.floor(Date.now() / 1000),
        }

        sendLogToRender(JSON.stringify(notification, null, 2), 'log')
        sendLogToRender(`version ${version}`, 'log')
        sendLogToRender(`releaseDate ${releaseDate}`, 'log')
        sendLogToRender(`releaseNote ${releaseNote}`, 'log')

        const notificationId = insertNotification(notification)

        mainWindow.webContents.send('mainMessage', {
          action: 'notification',
          data: {
            id: notificationId,
            title: notification.title,
            content: notification.content,
            type: notification.type,
            isNew: true,
            isError: false,
            createdAt: notification.createdAt,
          },
        })

        // insertNotification(notification)
      }
    })
    autoUpdater.on('update-not-available', () => {
      if (manualCheckForUpdate) {
        mainWindow.webContents.send('mainMessage', {
          action: 'updateNotAvailable',
        })
      } else {
        console.log('update not available')
      }
    })
    autoUpdater.on('update-downloaded', (event) => {
      const version = event.version
      const releaseDate = event.releaseDate
      const releaseNote = event.releaseNotes

      console.log('update released note', releaseNote)
      const notification: Notification = {
        title: `New update downloaded ${version} from ${releaseDate}`,
        content: '',
        type: 'update',
        read: 0,
        isError: false,
        createdAt: Math.floor(Date.now() / 1000),
      }

      // insertNotification(notification)
    })
    //TODO: add a notification than an update has been downloaded
    // title: New Update Downloaded <version>
    // body: <come up with something>

    autoUpdater.checkForUpdates().catch((error) => console.log('error', error))

    autoCheckFoUpdateInterval = setInterval(
      () => autoUpdater.checkForUpdates().catch((error) => console.log('error', error)),
      AUTO_UPDATE_CHECK_TIME,
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

ipcMain.handle('checkForUpdates', (event) => {
  return new Promise(async (reject, resolve) => {
    try {
      if (autoUpdater) {
        manualCheckForUpdate = true
        clearInterval(autoCheckFoUpdateInterval)
        await autoUpdater.checkForUpdates()
        resolve(true)
      }
    } catch (error) {
      reject(error)
    } finally {
      manualCheckForUpdate = false

      autoCheckFoUpdateInterval = setInterval(
        () => autoUpdater.checkForUpdates().catch((error) => console.log('error', error)),
        AUTO_UPDATE_CHECK_TIME,
      )
    }
  })
})

ipcMain.on('downloadUpdate', () => {
  autoUpdater.downloadUpdate().then((result) => console.log('download result', result))
})

ipcMain.on('installUpdate', () => {
  autoUpdater.quitAndInstall()
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

// EXPENSES
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
  //TODO: make it a transaction and delete notifications too
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

    return {
      inserted: result,
      duplicates,
      errors,
    }
  },
)

// NOTIFICATIONS
ipcMain.handle('getNotifications', (event, payload): Notification[] => {
  const getExpensesListStatement = db.prepare(
    'SELECT id, title, content, read, type, error as isError, created_at as createdAt FROM notifications ORDER BY notifications.created_at DESC LIMIT @limit OFFSET @offset',
  )
  return getExpensesListStatement.all({
    offset: payload.offset,
    limit: payload.limit,
  }) as Notification[]
})

function insertNotification(payload: Notification) {
  const insertExpenseStatement = db.prepare(
    'INSERT INTO notifications (title, content, type, error, created_at) VALUES (@title, @content, @type, @error, @createdAt)',
  )

  const result = insertExpenseStatement.run({
    title: payload.title,
    content: payload.content,
    type: payload.type,
    error: 0,
    createdAt: payload.createdAt,
  })

  return result.lastInsertRowid
}
ipcMain.handle('addNotification', async (event, payload: Notification) => {
  insertNotification(payload)
})
ipcMain.handle('markNotificationAsRead', async (event, payload: number) => {
  const markNotificationAsReadStatement = db.prepare(
    'UPDATE notifications SET read = @read WHERE id = @id',
  )
  const result = markNotificationAsReadStatement.run({
    read: 1,
    id: payload,
  })

  return result.changes
})
ipcMain.handle('markAllNotificationsAsRead', async () => {
  const markNotificationAsReadStatement = db.prepare(
    'UPDATE notifications SET read = 1 WHERE read == 0',
  )
  const result = markNotificationAsReadStatement.run()
  return result.changes
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

const sendLogToRender = (data: string, type: string) => {
  mainWindow.webContents.send('mainMessage', { action: 'log', data, type })
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}
