import crypto from 'crypto';
import RPC from 'discord-rpc';
import { app, BrowserWindow, Menu, shell } from "electron";
import { getConfig } from './helpers';


function listenContextMenu(window: BrowserWindow): void {
  // Menu contextuel
  const menu = Menu.buildFromTemplate([
    {
      click: () => window.webContents.goBack(),
      enabled: window.webContents.canGoBack(),
      label: "Retour"
    },
    {
      click: () => window.webContents.goForward(),
      enabled: window.webContents.canGoForward(),
      label: "Suivant"
    },
    { role: "reload" },
    { type: "separator" },
    { role: "zoomIn" },
    { role: "zoomOut" },
    { role: "resetZoom" },
    { type: "separator" },
    {
      click: () => toggleDiscordRPC(),
      label: (global.rpc ? "Désactiver" : "Activer") + " le RPC Discord"
    }
  ]);

  window.webContents.removeAllListeners('context-menu');
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

  const partitionURL = new URL(targetUrl).hostname;
  const sha1 = crypto.createHash("sha1");
  const partition = sha1.update(partitionURL, "utf8").digest("hex").substring(0, 16);

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
      partition: "persist:" + partition,
    },
  });


  window.loadURL(targetUrl);

  window.once("ready-to-show", () => {
    window.webContents.setZoomFactor(1.0);
    window.show();

    const config = getConfig();
    config.discord && toggleDiscordRPC();
  });

  window.webContents.on('will-navigate', (event, url) => {
    const isExternal = new URL(url).hostname !== new URL(targetUrl).hostname;
    if (isExternal) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  window.webContents.on('did-navigate', (event, url) => {
    listenContextMenu(window);
  })

  window.webContents.on('new-window', (event, url) => {
    const isExternal = new URL(url).hostname !== new URL(targetUrl).hostname;
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


function toggleDiscordRPC() {

  if (global.rpc) {
    try {
      global.rpc.clearActivity();
      global.rpc.destroy();
    } catch (err) {
      // sûrement parce que le RPC n'était pas connecté
    }

    global.rpc = undefined;
  } else {
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

      // si on arrive à se connecter, on enregistre le client en tant que variable globale
      global.rpc = client;
    });
    client.login({ clientId }).catch(console.error);
  }
}