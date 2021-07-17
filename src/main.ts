"use strict";

import { app, BrowserWindow, dialog } from "electron";
import log from "electron-log";
import { createWindow, getPluginName } from "./utils";
import { autoUpdater } from "electron-updater";

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

autoUpdater.on("update-available", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Mises à jour",
      message: "Mise à jour trouvée. Voulez-vous mettre à jour ?",
      buttons: ["Oui", "Non"],
    })
    .then((buttonIndex) => {
      autoUpdater.downloadUpdate();
    });
});

autoUpdater.on("update-not-available", () => {
  dialog.showMessageBox({
    title: "Aucune nouvelle mise à jour",
    message: "Vous êtes à jour.",
  });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      title: "Mise à jour installée",
      message: "Mise à jour installée, l'application va se fermer",
    })
    .then(() => {
      setImmediate(() => autoUpdater.quitAndInstall());
    });
});

let window: BrowserWindow | null = null;
try {
  const { pluginName, pluginPath } = getPluginName();
  if (process.platform === "linux") {
    app.commandLine.appendSwitch("no-sandbox");
  }

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
      if (BrowserWindow.getAllWindows().length) {
        window = createWindow();
      }
    });

    log.transports.file.level = "debug";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
    autoUpdater.checkForUpdates();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
} catch (reason) {
  log.error(reason);
}
