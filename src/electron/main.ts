import path, { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'
import { Expense } from '../types/expense'
import electronUpdater from 'electron-updater'
import fsp from 'fs/promises'
import { ImportedExpense } from '../types/importedExpense'
import { DbImportResult } from '../types/dbImportResult'
import sleep from '../helpers/sleep.js'
import { Notification } from '../types/notification'
import { dataToCsv } from '../helpers/dataToCsv.js'
import runMigrations from '../migrations/runMigrations.js'
import * as fs from 'node:fs'
const isDev = process.env.npm_lifecycle_event === 'desktop:dev'

const { autoUpdater } = electronUpdater
let autoCheckFoUpdateInterval: any | null = null
const AUTO_UPDATE_CHECK_TIME = 60 * 60000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dbPath = path.join(app.getPath('userData'), 'expenses.db')

if (isDev) {
  dbPath = 'expenses.db'
}

const dataPath = app.getPath('userData')
const configFilePath = path.join(dataPath, 'config.json')
async function writeConfigData(key: string, value: string | boolean) {
  const content = parseConfigData()
  content[key] = value
  fs.writeFileSync(configFilePath, JSON.stringify(content, null, 2))
}

function readConfigData(key: string) {
  const content = parseConfigData()
  return content[key]
}

function parseConfigData() {
  const dataFromFile = fs.readFileSync(configFilePath, 'utf8')
  return JSON.parse(dataFromFile)
}

let isHardwareAccelerationEnabled: boolean = false
isHardwareAccelerationEnabled = readConfigData('hardwareAcceleration')
if (
  isHardwareAccelerationEnabled === undefined ||
  (typeof isHardwareAccelerationEnabled === 'boolean' && isHardwareAccelerationEnabled)
) {
  isHardwareAccelerationEnabled = true
  // app.commandLine.appendSwitch('disable-gpu-rasterization')
} else {
  app.disableHardwareAcceleration()
  isHardwareAccelerationEnabled = false
}

// @ts-ignore
let db: Database | undefined

let mainWindow: BrowserWindow | undefined

const createWindow = () => {
  return new Promise((resolve, reject) => {
    try {
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
      // mainWindow.loadURL('chrome://gpu')
      // mainWindow.webContents.openDevTools()

      mainWindow.on('closed', () => {
        mainWindow = undefined
      })

      mainWindow.on('ready-to-show', () => {
        sendLogToRender('readyToShow', 'log')
        sendLogToRender(`hardwareAcceleration ${isHardwareAccelerationEnabled}`, 'log')

        // sendLogToRender('readyToShow', 'error')
        resolve(true)
      })
    } catch (error) {
      reject(error)
    }
  })
}

function setAutoUpdate(value: boolean): void {
  if (value) {
    autoUpdater.autoDownload = true
    autoCheckFoUpdateInterval = setInterval(
      () => autoUpdater.checkForUpdates().catch((error) => console.log('error', error)),
      AUTO_UPDATE_CHECK_TIME,
    )
  } else {
    autoUpdater.autoDownload = false
    clearInterval(autoCheckFoUpdateInterval)
  }
}

function getAutoUpdate() {
  let autoUpdate = readConfigData('autoUpdate')

  if (typeof autoUpdate === 'undefined') {
    writeConfigData('autoUpdate', true)
    autoUpdate = true
  }

  setAutoUpdate(autoUpdate)

  mainWindow.webContents.send('mainMessage', {
    action: 'autoUpdate',
    data: {
      value: autoUpdate,
    },
  })

  return autoUpdate
}

const gotTheLock = app.requestSingleInstanceLock()

if (gotTheLock) {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.setSkipTaskbar(false)
      mainWindow.focus()
    }
  })

  app.whenReady().then(async () => {
    db = new Database(dbPath, {})
    db.pragma('journal_mode = WAL')

    runMigrations(db)

    await createWindow()

    if (!isDev) {
      const result = getAutoUpdate()
      if (result) {
        autoUpdater.checkForUpdates().catch((error) => console.error('error', error))
      }

      autoUpdater.on('checking-for-update', () => {
        sendLogToRender('checking for update', 'log')
      })

      autoUpdater.on('update-available', (event) => {
        const version = event.version
        const releaseDate = event.releaseDate
        const releaseNote = event.releaseNotes

        // const notification: Notification = {
        //   title: `New update available v${version} from ${formatDate(releaseDate)}`,
        //   content: releaseNote.toString(),
        //   type: 'update',
        //   read: 0,
        //   isError: false,
        //   createdAt: Math.floor(Date.now() / 1000),
        // }

        mainWindow.webContents.send('mainMessage', {
          action: 'updateAvailable',
          data: {
            content: releaseNote,
            date: releaseDate,
            version,
          },
        })
      })

      autoUpdater.on('update-not-available', () => {
        mainWindow.webContents.send('mainMessage', {
          action: 'updateNotAvailable',
        })
      })

      autoUpdater.on('download-progress', (event) => {
        sendLogToRender(`downloadProgress ${JSON.stringify(event)}`, 'log')
      })

      autoUpdater.on('update-downloaded', (event) => {
        readAutoRestartConfig().then((value) => {
          const version = event.version
          const releaseDate = event.releaseDate
          const releaseNote = event.releaseNotes

          mainWindow.webContents.send('mainMessage', {
            action: 'updateDownloaded',
            data: {
              content: releaseNote,
              date: releaseDate,
              version: version,
              autoRestart: value,
            },
          })

          if (value) {
            autoUpdater.quitAndInstall()
          }
        })
      })

      //TODO: add a notification than an update has been downloaded
      // title: New Update Downloaded <version>
      // body: <come up with something>
    }

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
} else {
  app.quit()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('requestHardwareAccelerationValue', () => {
  return isHardwareAccelerationEnabled
})

ipcMain.handle('requestLaunchAtSystemStartupValue', () => {
  const login = app.getLoginItemSettings()
  return login.openAtLogin
})

ipcMain.handle('requestAutoRestartValue', async () => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const autoRestart = await readAutoRestartConfig()
      resolve(autoRestart)
    } catch (error) {
      reject(error)
    }
  })
})

async function readAutoRestartConfig(): Promise<boolean> {
  try {
    const autoRestart = await readConfigData('autoRestart')
    if (autoRestart === undefined) {
      return false
    } else {
      return autoRestart
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

ipcMain.on('closeApp', () => {
  mainWindow.close()
})
ipcMain.on('minimizeApp', () => {
  mainWindow.minimize()
})

ipcMain.on('restartNow', () => {
  app.relaunch()
  app.quit()
})

ipcMain.handle('checkForUpdate', () => {
  return new Promise<void>((resolve, reject) => {
    autoUpdater
      .checkForUpdates()
      .then(() => {
        resolve()
      })
      .catch((error) => reject(error))
  })
})

ipcMain.handle('downloadUpdate', () => {
  return new Promise<void>((resolve, reject) => {
    autoUpdater
      .downloadUpdate()
      .then(() => {
        resolve()
      })
      .catch((error) => reject(error))
  })
})

ipcMain.handle('setAutoUpdate', (event, payload: boolean) => {
  setAutoUpdate(payload)
  writeConfigData('autoUpdate', payload)
})

// set auto restart after an update is downloaded (auto install update)
ipcMain.handle('setAutoRestart', async (event, payload: boolean) => {
  writeConfigData('autoRestart', payload)
})

ipcMain.on('quitAndInstall', () => {
  autoUpdater.quitAndInstall()
})

ipcMain.handle('setHardwareAcceleration', (event, value: boolean) => {
  console.log('setHardwareAcceleration', value)
  writeConfigData('hardwareAcceleration', value)
})

ipcMain.handle('checkForUpdates', () => {
  return new Promise(async (reject, resolve) => {
    try {
      if (autoUpdater) {
        clearInterval(autoCheckFoUpdateInterval)
        await autoUpdater.checkForUpdates()
        resolve(true)
      }
    } catch (error) {
      reject(error)
    } finally {
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

ipcMain.on('setLaunchAtSystemStartup', (event, payload: boolean) => {
  app.setLoginItemSettings({
    openAtLogin: payload,
  })
})

// EXPENSES
ipcMain.handle('insertExpense', (event, expense: Expense) => {
  const insertExpenseStatement = db.prepare(
    'INSERT INTO expenses (value, currency, date, description, created_at) VALUES (@value, @currency, @date, @description, @created_at)',
  )
  let description: string = ''

  if (expense.description) {
    description = expense.description
  }

  const result = insertExpenseStatement.run({
    value: expense.value,
    currency: expense.currency,
    date: expense.date.toString(),
    description,
    created_at: expense.created_at,
  })

  return result.lastInsertRowid
})

ipcMain.handle(
  'updateExpenseDescription',
  (event, payload: { id: number; description: string; updatedAt: number }) => {
    const updateExpenseStatement = db.prepare(
      'UPDATE  expenses SET description = @description, updated_at = @updatedAt WHERE id = @id',
    )

    const result = updateExpenseStatement.run({
      id: payload.id,
      description: payload.description,
      updatedAt: payload.updatedAt,
    })

    return result.changes
  },
)

ipcMain.handle(
  'updateExpenseValue',
  (event, payload: { id: number; value: number; currency: string; updatedAt: number }) => {
    const updateExpenseStatement = db.prepare(
      'UPDATE expenses SET value = @value, updated_at = @updatedAt, currency = @currency  WHERE id = @id',
    )

    const result = updateExpenseStatement.run({
      id: payload.id,
      value: payload.value,
      currency: payload.currency,
      updatedAt: payload.updatedAt,
    })

    return result.changes
  },
)

ipcMain.handle('updateExpenseDate', (event, payload: { id: number; date: number }) => {
  const updateExpenseStatement = db.prepare(`
    UPDATE expenses
    SET date = @date, updated_at = unixepoch()
    WHERE id = @id
    RETURNING updated_at
  `)

  const result = updateExpenseStatement.get({
    id: payload.id,
    date: payload.date,
  }) as { id: number; date: number; updated_at: number } | undefined

  return result ? result.updated_at : null
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
    const limit = 25
    let offset = 0

    const getExpensesListStatement = db.prepare(
      'SELECT value, currency, date FROM expenses LIMIT @limit OFFSET @offset',
    )

    let expenses = getExpensesListStatement.all({
      limit,
      offset,
    }) as Expense[]

    let expensesCount = expenses.length
    if (expensesCount > 0) {
      const csvBlob = await dataToCsv(expenses)
      const csvArrayBuffer = await csvBlob.arrayBuffer()

      const buffer = Buffer.from(csvArrayBuffer)

      await saveFile({
        fileName,
        buffer,
        increment: 0,
      })

      while (expensesCount >= limit) {
        offset += limit

        expenses = getExpensesListStatement.all({
          limit,
          offset,
        }) as Expense[]

        expensesCount = expenses.length
        if (expensesCount > 0) {
          const csvBlob = await dataToCsv(expenses, false)
          const csvArrayBuffer = await csvBlob.arrayBuffer()
          let buffer = Buffer.from(csvArrayBuffer)
          buffer = Buffer.concat([buffer, Buffer.from('\n')])

          // TODO: find a way to not add an empty row at the end

          await saveFile({
            fileName,
            buffer,
            increment: 0,
            append: true,
          })
        }
      }
    }

    await sleep(5000)
  } catch (error) {
    console.error('exportExpensesError', error)
  }
})
ipcMain.handle(
  'importExpenses',
  async (event, expenses: ImportedExpense[]): Promise<DbImportResult> => {
    let duplicates = 0
    const errors: any[] = []

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
          } catch (error: any) {
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

    return {
      inserted: result.length,
      duplicates,
      errors,
    }
  },
)
ipcMain.handle('getExpensesForDate', async (event, date) => {
  const getExpensesListStatement = db.prepare(
    `SELECT SUM(value) as total, currency FROM expenses
     WHERE date >= strftime('%s', @date, 'unixepoch','localtime', 'start of day', 'utc')
     AND date < strftime('%s', @date, 'unixepoch',  'localtime', 'start of day', '+1 day', 'utc')
     GROUP BY currency
     ORDER BY date DESC;`,
  )
  return getExpensesListStatement.all({
    date,
  })
})

// NOTIFICATIONS
ipcMain.handle('getNotifications', (event, payload): Notification[] => {
  const getNotificationsStatement = db.prepare(
    'SELECT id, title, content, read, type, error as isError, created_at as createdAt FROM notifications ORDER BY notifications.created_at DESC LIMIT @limit OFFSET @offset',
  )
  return getNotificationsStatement.all({
    offset: payload.offset,
    limit: payload.limit,
  }) as Notification[]
})

ipcMain.handle('addNotification', async (event, payload: Notification) => {
  const addNotificationStatement = db.prepare(
    'INSERT INTO notifications (title, content, type, read, error, created_at) VALUES (@title, @content, @type, @read, @error, @createdAt)',
  )

  const result = addNotificationStatement.run({
    title: payload.title,
    content: payload.content,
    type: payload.type,
    read: payload.read,
    error: 0,
    createdAt: payload.createdAt,
  })

  return result.lastInsertRowid
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

const saveFile = async (data: {
  fileName: string
  buffer: Buffer
  increment: number
  append?: boolean
}) => {
  const fileNameWithoutExtension = path.parse(data.fileName).name
  const extension = path.parse(data.fileName).ext

  let fileName = ''
  let filePath = ''

  fileName = `${fileNameWithoutExtension}${
    data.increment > 0 ? `(${data.increment})` : ''
  }${extension}`
  filePath = `${app.getPath('downloads')}/${fileName}`
  try {
    let flags = 'wx'

    if (data.append) {
      flags = 'a'
    }

    await fsp.writeFile(filePath, data.buffer, { flag: flags })
  } catch (err: any) {
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

/*
const formatDate = (isoString: string): string => {
  const date = new Date(isoString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}
*/
