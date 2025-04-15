// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
  close: () => ipcRenderer.send('closeApp'),
  // we can also expose variables, not just functions
})
