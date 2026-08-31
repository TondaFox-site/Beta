const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Fox Windows App',
    backgroundColor: '#111318',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  if (isDev) win.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
  createWindow();

  const template = [
    {
      label: 'Soubor',
      submenu: [
        { label: 'Nový panel', accelerator: 'Ctrl+N', click: () => BrowserWindow.getFocusedWindow()?.webContents.send('new-panel') },
        { type: 'separator' },
        { role: 'quit', label: 'Ukončit' }
      ]
    },
    {
      label: 'Zobrazit',
      submenu: [
        { role: 'reload', label: 'Obnovit' },
        { role: 'togglefullscreen', label: 'Celá obrazovka' },
        { role: 'toggleDevTools', label: 'Vývojářské nástroje' }
      ]
    },
    {
      label: 'Nápověda',
      submenu: [
        { label: 'Web projektu', click: () => shell.openExternal('https://example.com') },
        { label: 'O aplikaci', click: () => BrowserWindow.getFocusedWindow()?.webContents.send('about') }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('app-info', () => ({
  name: app.getName(),
  version: app.getVersion(),
  platform: process.platform,
  arch: process.arch,
  electron: process.versions.electron,
  chromium: process.versions.chrome
}));
