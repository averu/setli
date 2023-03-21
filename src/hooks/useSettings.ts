import { useCallback } from "react";
import { invoke } from "@tauri-apps/api";
import { Settings } from "../types";
import { hasUncaughtExceptionCaptureCallback } from "process";

interface UpdateSettingsArgs {
  sceneName: string;
  textName: string;
  fontFamily: string;
  fontColor: string;
  outline: boolean;
  outlineWidth: number;
}

export function useSettings() {
  const convertHexToDecimal = (hex: string) => {
    console.log(hex);
    const convertedHex = hex.slice(1);
    const obsBlue = convertedHex.substring(0, 2);
    const obsGreen = convertedHex.substring(2, 4);
    const obsRed = convertedHex.substring(4, 6);
    const obsColor = `${obsRed}${obsGreen}${obsBlue}`;
    console.log(parseInt(obsColor, 16));
    return parseInt(obsColor, 16);
  };

  const updateSettings = useCallback(async (settings: UpdateSettingsArgs) => {
    try {
      await invoke("update_settings_to_obs", {
        settings: {
          scene_name: settings.sceneName,
          text_name: settings.textName,
          font_family: settings.fontFamily,
          font_color: convertHexToDecimal(settings.fontColor),
          outline: settings.outline,
          outline_width: settings.outlineWidth,
        },
      });
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getSettings = useCallback(async (): Promise<Settings> => {
    try {
      // Check if settings exist in local storage
      const localSettings = localStorage.getItem("settings");
      if (localSettings) {
        console.log("Using local settings");
        return JSON.parse(localSettings);
      }
      console.log("Using API settings");
      // If not, get settings from API
      const apiSettings = await invoke<Settings>("get_settings");
      return apiSettings;
    } catch (e) {
      console.error(e);
      return {} as Settings;
    }
  }, []);

  return { updateSettings, getSettings };
}
