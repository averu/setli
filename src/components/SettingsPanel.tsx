import React, { useState, useEffect } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import styles from "./SettingsPanel.module.css";
import { useSettings } from "../hooks/useSettings";

function SettingsPanel() {
  const [sceneName, setSceneName] = useState<string>("シーン");
  const [textName, setTextName] = useState<string>("setli");
  const [fontColor, setFontColor] = useState<string>("#ffffff");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [outline, setOutline] = useState<boolean>(false);
  const [outlineWidth, setOutlineWidth] = useState<number>(1);

  const { updateSettings } = useSettings();

  function handleSceneNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSceneName(e.target.value);
  }

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

  return (
    <div className={styles.settingsPanel}>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Scene</label>
        <div className={styles.settingsInput}>
          <input
            type="text"
            value={sceneName}
            onChange={handleSceneNameChange}
          />
        </div>
      </div>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Name</label>
        <div className={styles.settingsInput}>
          <input type="text" value={textName} onChange={handleTextNameChange} />
        </div>
      </div>
      <div className={styles.settingsGroup}>
        <label className={styles.settingsLabel}>Font Color</label>
        <div className={styles.settingsInput}>
          <span>{fontColor}</span>
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
          <select value={fontFamily} onChange={handleFontFamilyChange}>
            <option>Meiryo</option>
            <option>Helvetica</option>
            <option>Arial</option>
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
            min="0"
            max="100"
            step="1"
            defaultValue="1"
            value={outlineWidth}
            onChange={handleOutlineWidhtChange}
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
