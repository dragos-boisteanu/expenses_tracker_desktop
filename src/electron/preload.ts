// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
  close: () => ipcRenderer.send('closeApp'),
  minimizeApp: () => ipcRenderer.send('minimizeApp'),
  setLaunchAtSystemStartup: (value: boolean) => ipcRenderer.send('setLaunchAtSystemStartup', value),
  getLaunchAtSystemStartup: () => ipcRenderer.invoke('getLaunchAtSystemStartup'),
})

// TODO: handle errors for all calls
contextBridge.exposeInMainWorld('db', {
  insert: (expense) => ipcRenderer.invoke('insertExpense', expense),
  delete: (expenseId) => ipcRenderer.invoke('deleteExpense', expenseId),
  deleteAllData: () => ipcRenderer.invoke('deleteAllData'),
  getList: (offset, limit) => ipcRenderer.invoke('getExpenses', { offset, limit }),
  exportExpenses: (fileName) => ipcRenderer.invoke('exportExpenses', fileName),
  importExpenses: (expenses) => ipcRenderer.invoke('importExpenses', expenses),
})
