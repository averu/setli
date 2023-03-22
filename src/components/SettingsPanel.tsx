import React, { useState, useEffect } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import styles from "./SettingsPanel.module.css";
import { useSettings } from "../hooks/useSettings";
import { Settings } from "../types";

function SettingsPanel() {
  const [sceneName, setSceneName] = useState<string>("シーン");
  const [textName, setTextName] = useState<string>("setli");
  const [fontColor, setFontColor] = useState<string>("#ffffff");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [outline, setOutline] = useState<boolean>(false);
  const [outlineWidth, setOutlineWidth] = useState<number>(1);
  const [outlineColor, setOutlineColor] = useState<string>("#ffffff");
  const [fontList, setFontList] = useState<string[]>([]);
  const [lineBreaks, setLineBreaks] = useState<number>(1);

  const { updateSettings, getSettings, getFonts } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      const fonts: string[] = await getFonts();
      setFontList(fonts);
      const settings: Settings | undefined = await getSettings();
      if (settings) {
        setSceneName(settings.sceneName);
        setTextName(settings.textName);
        setFontColor(settings.fontColor);
        setFontFamily(settings.fontFamily);
        setOutline(settings.outline);
        setOutlineWidth(settings.outlineWidth);
        setOutlineColor(settings.outlineColor);
        setLineBreaks(settings.lineBreaks);
      }
    };
    fetchData();
  }, []);

  // function handleSceneNameChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   setSceneName(e.target.value);
  // }

  function handleTextNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTextName(e.target.value);
  }

  function handleFontFamilyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFontFamily(e.target.value);
  }

  function handleFontColorChange(e: {
    target: { value: React.SetStateAction<string> };
  }) {
    setFontColor(e.target.value);
  }

  function handleOutlineChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOutline(e.target.checked);
  }

  function handleOutlineWidhtChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOutlineWidth(Number(e.target.value));
  }

  function handleOutlineColorChange(e: {
    target: { value: React.SetStateAction<string> };
  }) {
    setOutlineColor(e.target.value);
  }

  function handleLineBreaksChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLineBreaks(Number(e.target.value));
  }

  return (
    <div className={styles.settingsPanel}>
      {/* <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Scene Name</label>
        <div className={styles.settingsInput}>
          <input
            type="text"
            value={sceneName}
            onChange={handleSceneNameChange}
          />
        </div>
      </div> */}
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Text Source</label>
        <div className={styles.settingsInput}>
          <input type="text" value={textName} onChange={handleTextNameChange} />
        </div>
      </div>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Font Color</label>
        <div className={styles.settingsInput}>
          <span>{fontColor.toUpperCase()}</span>
          <input
            type="color"
            value={fontColor}
            onChange={handleFontColorChange}
          />
        </div>
      </div>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Font Familiy</label>
        <div className={styles.settingsInput}>
          <select onChange={handleFontFamilyChange}>
            {fontList.map((font, index) => (
              <option key={index} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Outline</label>
        <div className={styles.settingsInput}>
          <Toggle checked={outline} onChange={(e) => handleOutlineChange(e)} />
        </div>
      </div>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Outline Width</label>
        <div className={styles.settingsInput}>
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            defaultValue="1"
            value={outlineWidth}
            onChange={handleOutlineWidhtChange}
          />
        </div>
      </div>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Outline Color</label>
        <div className={styles.settingsInput}>
          <span>{outlineColor.toUpperCase()}</span>
          <input
            type="color"
            value={outlineColor}
            onChange={handleOutlineColorChange}
          />
        </div>
      </div>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Line Breaks</label>
        <div className={styles.settingsInput}>
          <input
            type="number"
            min="1"
            max="2"
            step="1"
            defaultValue="1"
            value={lineBreaks}
            onChange={handleLineBreaksChange}
          />
        </div>
      </div>
      <div className={styles.settingsButton}>
        <button
          onClick={() =>
            updateSettings({
              sceneName: sceneName,
              textName: textName,
              fontFamily: fontFamily,
              fontColor: fontColor,
              outline: outline,
              outlineWidth: outlineWidth,
              outlineColor: outlineColor,
              lineBreaks: lineBreaks,
            })
          }
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default SettingsPanel;
