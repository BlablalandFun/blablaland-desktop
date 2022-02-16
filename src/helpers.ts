import { app } from 'electron';
import { ConfigData } from '../types/types';
import path from 'path';
import fs from 'fs';

function getConfigPath() {
  return app.getPath("userData");
}

export function saveConfig(config: ConfigData): ConfigData {
  const configPath = getConfigPath();
  const configFile = path.join(configPath, "config.json");
  fs.writeFileSync(configFile, JSON.stringify(config));
  return config;
}

export function getConfig(): ConfigData {
  const configPath = getConfigPath();
  const configFile = path.join(configPath, "config.json");

  // si le fichier de config n'existe pas, on le créé
  if (!fs.existsSync(configFile)) {
    return saveConfig({ discord: true });
  }

  return JSON.parse(fs.readFileSync(configFile).toString());
}

export function getPluginFile(): string {
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

export function getPluginPlatform(): string {
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