import crypto from 'crypto';
import { app, BrowserWindow, Menu, shell } from "electron";
import fs from "fs";
import path from "path";

import RPC from 'discord-rpc'

function getPluginFile(): string {
  switch (process.platform) {
    case "win32":
      return "pepflashplayer.dll";
    case "darwin":
      return "PepperFlashPlayer.plugin";
    case "freebsd":
    case "linux":
    case "openbsd":
    case "netbsd":
      app.commandLine.appendSwitch("no-sandbox");
      return "libpepflashplayer.so";
    default:
      throw new Error("Impossible de trouver le plugin de votre plateforme.");
  }
}

function getPluginPlatform(): string {
  switch (process.platform) {
    case "linux":
      return "linux";
    case "darwin":
      return "mac";
    case "win32":
      return "win";
    default:
      throw new Error("Impossible de trouver le plugin de votre plateforme.");
  }
}

export function getPluginPath(): string {
  const pluginName = getPluginFile();

  // si l'application est en prod
  let pluginPath;
  if (app.isPackaged) {
    pluginPath = path.join(process.resourcesPath, "plugins", pluginName);
  } else {
    pluginPath = path.join("plugins", getPluginPlatform(), process.arch, pluginName);
  }

  if (!fs.existsSync(pluginPath)) {
    throw new Error("Le plugin n'existe pas ou n'est pas trouvable.");
  }
  return pluginPath;
}

function listenContextMenu(window: BrowserWindow): void {
  // Menu contextuel
  const menu = Menu.buildFromTemplate([
    { role: "selectPreviousTab", label: "Retour" },
    { role: "selectNextTab", label: "Suivant" },
    { role: "reload", label: "Actualiser" },
    { type: "separator" },
    { role: "zoomIn", label: "Zoom en avant" },
    { role: "zoomOut", label: "Zoom en arrière" },
    { role: "resetZoom", label: "Réinitialiser le zoom" },
  ]);

  window.webContents.on("context-menu", (e, params) => {
    menu.popup({
      window,
      x: params.x,
      y: params.y,
    });
  });
}

/** Créer la fenêtre */
export function createWindow(): BrowserWindow {
  let targetUrl = app.commandLine.getSwitchValue("target");
  if (targetUrl === "") {
    targetUrl = "https://blablaland.fun/login";
  }

  const sha1 = crypto.createHash("sha1");
  const partition = sha1.update(targetUrl, "utf8").digest("hex").substring(0, 16);
  const window = new BrowserWindow({
    title: "Blablaland",
    width: 1280,
    height: 720,
    // fullscreen: true,
    useContentSize: true,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true,
      plugins: true,
      contextIsolation: true,
      partition,
    },
  });


  window.loadURL(targetUrl);

  window.once("ready-to-show", () => {
    window.webContents.setZoomFactor(1.0);
    window.show();

    enableDiscordRPC();
  });

  window.webContents.on('will-navigate', (event, url) => {
    const isExternal = new URL(url).hostname !== "blablaland.fun";
    if (isExternal) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  window.webContents.on('new-window', (event, url) => {
    const isExternal = new URL(url).hostname !== "blablaland.fun";
    if (isExternal) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  app.on("browser-window-created", (e, win) => {
    listenContextMenu(win);
  });

  listenContextMenu(window);

  return window;
}


function enableDiscordRPC() {
  const clientId = '684370117793939515';

  const client = new RPC.Client({
    transport: 'ipc',
  });
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}`);
    client.setActivity({
      state: 'Joue à Blablaland.fun',
      startTimestamp: new Date(),
      largeImageKey: '512x512',
      instance: false,
    });
  });

  client.login({ clientId }).catch(console.error);
}