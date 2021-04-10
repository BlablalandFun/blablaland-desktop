'use strict'

import { app, BrowserWindow } from 'electron'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({ webPreferences: { nodeIntegration: true } })

  if (isDevelopment) {
    window.loadURL(`http://local.blablaland.fun/`)
  } else {
    window.loadURL("https://blablaland.fun/IY7gDz6afMRKasNupDMDmRWCtXbrsRf1s6sjwScRRVfgMsH5wm2QWIcp8SsgVeRjw6uksNo1WqsHebRFVojVBmlZoDD3spwPXLBaC3nkTrWMU4Q4Cg3K7t3jtGL0Iojb6TW4GxlBZ0dj2TWVGTF8Tawyv4WFXanzUA3VJ1RH9s8opnSUr8Xb2MbPhooxOZfFlETb7ijc")
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})
