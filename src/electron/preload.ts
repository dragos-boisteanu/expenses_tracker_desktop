// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
  close: () => ipcRenderer.send('closeApp'),
  minimizeApp: () => ipcRenderer.send('minimizeApp'),
})

// TODO: handle errors for all calls
contextBridge.exposeInMainWorld('db', {
  insert: (expense) => ipcRenderer.invoke('insertExpense', expense),
  delete: (expenseId: string) => ipcRenderer.invoke('deleteExpense', expenseId),
  getList: (offset, limit) => ipcRenderer.invoke('getExpenses', { offset, limit }),
  exportExpenses: (fileName: string) => ipcRenderer.invoke('exportExpenses', fileName),
})
