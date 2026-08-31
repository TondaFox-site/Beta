const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('foxAPI', {
  getAppInfo: () => ipcRenderer.invoke('app-info'),
  onNewPanel: (callback) => ipcRenderer.on('new-panel', callback),
  onAbout: (callback) => ipcRenderer.on('about', callback),
  platform: process.platform
});
