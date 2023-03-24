import React, { useState, useEffect } from "react";
import styles from "./OBSConnection.module.css";
import Icon from "../assets/icon.png";

interface Props {
  onConnect: (host: string, port: number, password: string) => void;
}

const OBSConnection: React.FC<Props> = ({ onConnect }) => {
  const storedHost = localStorage.getItem("host") || "";
  const storedPort = Number(localStorage.getItem("port")) || 4455;
  const storedPassword = localStorage.getItem("password") || "";

  const [host, setHost] = useState(storedHost);
  const [port, setPort] = useState(storedPort);
  const [password, setPassword] = useState(storedPassword);

  useEffect(() => {
    localStorage.setItem("host", host);
    localStorage.setItem("port", String(port));
    localStorage.setItem("password", password);
  }, [host, port, password]);

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
