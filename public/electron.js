"use strict";

const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const log = require("electron-log");
const fs = require("fs");

const partition = "persist:blablaland";

let window = null;
function createWindow() {
  window = new BrowserWindow({
    title: "Blablaland",
    width: 1280,
    height: 720,
    // fullscreen: true,
    useContentSize: true,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      partition,
      devTools: true,
      plugins: true,
      contextIsolation: true,
    },
  });

  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  window.once("ready-to-show", () => {
    window.webContents.setZoomFactor(1.0);
    window.show();
  });

  // Menu contextuel
  const menu = Menu.buildFromTemplate([
    { role: "reload", label: "Rafraîchir la page" },
    { type: "separator" },
    { role: "zoomIn", label: "Zoom en avant" },
    { role: "zoomOut", label: "Zoom en arrière" },
    { role: "resetZoom", label: "Réinitialiser le zoom" },
  ]);

  window.webContents.on("context-menu", (e, params) => {
    menu.popup(window, params.x, params.y);
  });
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  /** On ajoute le plugin "Flash Player" à l'application */
  let pluginName;
  switch (process.platform) {
    case "win32":
      pluginName = "pepflashplayer.dll";
      break;
    case "darwin":
      pluginName = "PepperFlashPlayer.plugin";
      break;
    case "linux":
      pluginName = "libpepflashplayer.so";
      break;
  }

  if (!pluginName) {
    log.error("Impossible de trouver le plugin de votre plateforme.");
    app.quit();
    return;
  }

  const pluginPath = path.join(process.resourcesPath, "plugins", pluginName);
  if (!fs.existsSync(pluginPath)) {
    log.error("Le plugin n'existe pas ou n'est pas trouvable.");
    app.quit();
    return;
  }

  // log.info("On vérifie si le plugin existe bien !");
  // log.info("path plugin : " + pluginPath);

  if (process.platform === "linux") {
    app.commandLine.appendSwitch("no-sandbox");
  }

  // log.info("ok c'est good");
  app.commandLine.appendSwitch("ppapi-flash-path", pluginPath);
  app.commandLine.appendSwitch("disable-http-cache");

  app.on("second-instance", () => {
    if (window) {
      if (window.isMinimized()) {
        window.restore();
      }
      window.focus();
    }
  });

  app.on("activate", () => {
    if (!window) {
      createWindow();
    }
  });

  app.on("ready", () => {
    createWindow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  // });
}
