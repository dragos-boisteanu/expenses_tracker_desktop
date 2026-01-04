// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
  close: () => ipcRenderer.send('closeApp'),
  minimizeApp: () => ipcRenderer.send('minimizeApp'),
  setLaunchAtSystemStartup: (value: boolean) => ipcRenderer.send('setLaunchAtSystemStartup', value),
  restartNow: () => ipcRenderer.send('restartNow'),
  quitAndInstall: () => ipcRenderer.send('quitAndInstall'),

  requestHardwareAccelerationValue: () => ipcRenderer.invoke('requestHardwareAccelerationValue'),
  requestLaunchAtSystemStartupValue: () => ipcRenderer.invoke('requestLaunchAtSystemStartupValue'),
  requestAutoRestartValue: () => ipcRenderer.invoke('requestAutoRestartValue'),

  setHardwareAcceleration: (value: boolean) => ipcRenderer.invoke('setHardwareAcceleration', value),

  checkForUpdate: () => ipcRenderer.invoke('checkForUpdate'),
  downloadUpdate: () => ipcRenderer.invoke('downloadUpdate'),
  setAutoUpdate: (value: boolean) => ipcRenderer.invoke('setAutoUpdate', value),
  setAutoRestart: (value: boolean) => ipcRenderer.invoke('setAutoRestart', value),

  mainMessage: (handler: (payload: { data: unknown; type: string }) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: any) => handler(payload)
    ipcRenderer.on('mainMessage', listener)

    // Return unsubscribe function
    return () => {
      ipcRenderer.removeListener('mainLog', listener)
    }
  },
})

// TODO: handle errors for all calls
contextBridge.exposeInMainWorld('db', {
  insert: (expense) => ipcRenderer.invoke('insertExpense', expense),
  delete: (expenseId) => ipcRenderer.invoke('deleteExpense', expenseId),
  deleteAllData: () => ipcRenderer.invoke('deleteAllData'),
  getList: (offset, limit) => ipcRenderer.invoke('getExpenses', { offset, limit }),
  exportExpenses: (fileName) => ipcRenderer.invoke('exportExpenses', fileName),
  importExpenses: (expenses) => ipcRenderer.invoke('importExpenses', expenses),
  getNotifications: (offset: number, limit: number) =>
    ipcRenderer.invoke('getNotifications', { offset, limit }),
  addNotification: (notification: Notification) =>
    ipcRenderer.invoke('addNotification', notification),
  markNotificationAsRead: (id: number) => ipcRenderer.invoke('markNotificationAsRead', id),
  markAllNotificationsAsRead: () => ipcRenderer.invoke('markAllNotificationsAsRead'),
  deleteNotification: (id: number) => ipcRenderer.invoke('deleteNotification', id),
  deleteNotifications: () => ipcRenderer.invoke('deleteNotifications'),
})
