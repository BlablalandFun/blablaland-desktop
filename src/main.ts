"use strict";

import { app, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import { createWindow, getPluginPath } from "./utils";

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let window: BrowserWindow | undefined = undefined;
try {
  const pluginPath = getPluginPath();

  /** On ajoute le plugin "Flash Player" à l'application */
  app.commandLine.appendSwitch("ppapi-flash-path", pluginPath);
  app.commandLine.appendSwitch("disable-http-cache");

  app.on("ready", () => {
    window = createWindow();

    app.on("second-instance", () => {
      if (window) {
        if (window.isMinimized()) {
          window.restore();
        }
        window.focus();
      }
    });
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        window = createWindow();
      }
    });

    // on ne cherche pas de mises à jour si on est en développement
    if (app.isPackaged) {
      autoUpdater.checkForUpdates().catch(console.error);
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
} catch (reason) {
  console.error(reason);
}
