'use strict'

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const partition = 'persist:blablaland';

let window;
function createWindow() {
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    // fullscreen: true,
    useContentSize: true,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      partition,
      devTools: false,
      plugins: true,
    },
  });
  
  window.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  
  window.once('ready-to-show', () => {
    window.webContents.setZoomFactor(1.0);
    window.show()
  });

  // Menu contextuel
  const menu = Menu.buildFromTemplate([
    { role: 'reload', label: 'Rafraîchir la page' },
    { type: 'separator' },
    { role: 'zoomIn', label: 'Zoom en avant' },
    { role: 'zoomOut', label: 'Zoom en arrière' },
    { role: 'resetZoom', label: 'Réinitialiser le zoom' },
  ]);

  window.webContents.on('context-menu', (e, params) => {
    menu.popup(window, params.x, params.y)
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  // Setup the Flash Player plugin
  let pluginName

  switch (process.platform) {
    case 'win32':
      pluginName = 'pepflashplayer.dll'
      break
    case 'darwin':
      pluginName = 'PepperFlashPlayer.plugin'
  }

  app.commandLine.appendSwitch('ppapi-flash-path', path.join(process.resourcesPath, 'plugins', pluginName))
  app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.363')

  // Create the application
  app.on('second-instance', () => window.focus())

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (!window) {
      createWindow();
    }
  })

  app.whenReady().then(createWindow);
}