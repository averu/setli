import React, { useState } from "react";
import styles from "./OBSConnection.module.css";

interface Props {
  onConnect: (host: string, port: number, password: string) => void;
}

const OBSConnection: React.FC<Props> = ({ onConnect }) => {
  const [host, setHost] = useState("192.168.1.7");
  const [port, setPort] = useState(4455);
  const [password, setPassword] = useState("l4VMzOcxjC3ymxtN");

  const handleConnect = () => {
    onConnect(host, port, password);
  };

  return (
    <div className={styles.obsConnection}>
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
      <div className={styles.buttonGroup}>
        <button onClick={handleConnect} className={styles.connectButton}>
          Connect
        </button>
      </div>
    </div>
  );
};

export default OBSConnection;
