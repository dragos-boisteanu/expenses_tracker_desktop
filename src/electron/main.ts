import { join } from 'path'
import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'

const isDev = process.env.npm_lifecycle_event === 'desktop:dev'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
    },
  })

  // and load the index.html of the app.

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173/') // Open the DevTools.
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
