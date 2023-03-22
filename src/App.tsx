import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import OBSConnection from "./components/OBSConnection";
import SongList from "./components/SongList";
import SettingsPanel from "./components/SettingsPanel";
import "./App.css";

function App() {
  const [connected, setConnected] = useState(false);

  const handleConnect = async (
    host: string,
    port: number,
    password: string
  ) => {
    try {
      const result: boolean = await invoke("connect_to_obs", {
        config: { host, port, password },
      });
      // 接続が成功したら、曲のリストを取得して表示する処理を追加
      setConnected(result);
      if (!result) {
        alert(`The field you want to enter is incorrect.`);
      }
    } catch (error) {
      alert(`Failed to connect: ${error}`);
    }
  };

  return (
    <div className="App">
      <div className="Container">
        {!connected ? (
          <OBSConnection onConnect={handleConnect} />
        ) : (
          <>
            <SongList />
            <SettingsPanel />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
