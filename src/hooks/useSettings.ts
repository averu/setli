import { invoke } from "@tauri-apps/api";
import { Settings } from "../types";

export function useSettings() {
  const convertHexToDecimal = (hex: string) => {
    const convertedHex = hex.slice(1);
    const obsBlue = convertedHex.substring(0, 2);
    const obsGreen = convertedHex.substring(2, 4);
    const obsRed = convertedHex.substring(4, 6);
    const obsColor = `${obsRed}${obsGreen}${obsBlue}`;
    return parseInt(obsColor, 16);
  };

  async function updateSettings(settings: Settings) {
    try {
      await invoke("update_settings_to_obs", {
        settings: {
          scene_name: settings.sceneName,
          text_name: settings.textName,
          font_family: settings.fontFamily,
          font_color: convertHexToDecimal(settings.fontColor),
          outline: settings.outline,
          outline_width: settings.outlineWidth,
          outline_color: convertHexToDecimal(settings.outlineColor),
          line_breaks: settings.lineBreaks,
        },
      });
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      alert(`Failed to update settings: ${error}`);
    }
  }

  async function getSettings(): Promise<Settings | undefined> {
    try {
      const localSettings = localStorage.getItem("settings");
      if (localSettings) {
        const parsedSettings: Settings = JSON.parse(localSettings);
        return parsedSettings;
      }
    } catch (error) {
      alert(`Failed to get settings: ${error}`);
      return {} as Settings;
    }
  }

  async function getFonts(): Promise<string[]> {
    try {
      const fonts: string[] = await invoke("get_fonts");
      return fonts;
    } catch (error) {
      alert(`Failed to get fonts: ${error}`);
      return [];
    }
  }

  return { updateSettings, getSettings, getFonts };
}
