import React, { useState } from "react";
import styles from "./OBSConnection.module.css";
import Icon from "../assets/icon.png";

interface Props {
  onConnect: (host: string, port: number, password: string) => void;
}

const OBSConnection: React.FC<Props> = ({ onConnect }) => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState(4455);
  const [password, setPassword] = useState("");

  const handleConnect = () => {
    onConnect(host, port, password);
  };

  return (
    <div className={styles.obsConnection}>
      <div className={styles.icon}>
        <img src={Icon} />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Host:</label>
        <div className={styles.inputContainer}>
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Port:</label>
        <div className={styles.inputContainer}>
          <input
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Password:</label>
        <div className={styles.inputContainer}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.connectButton}>
        <button onClick={handleConnect}>Connect</button>
      </div>
    </div>
  );
};

export default OBSConnection;
