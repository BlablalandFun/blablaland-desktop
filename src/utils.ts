import { BrowserWindow, Menu } from "electron";
import path from "path";
import fs from "fs";

export function getPluginName() {
  let pluginName: string | null = null;
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
    throw new Error("Impossible de trouver le plugin de votre plateforme.");
  }

  const pluginPath = path.join(process.resourcesPath, "plugins", pluginName);
  if (!fs.existsSync(pluginPath)) {
    console.log(pluginPath)
    throw new Error("Le plugin n'existe pas ou n'est pas trouvable.");
  }

  return {
    pluginName,
    pluginPath,
  };
}

export function createWindow() {
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
    },
  });

  window.loadURL("https://blablaland.fun/login");

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
    menu.popup({
      window,
      x: params.x,
      y: params.y,
    });
  });

  return window;
}
