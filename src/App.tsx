import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import OBSConnection from "./components/OBSConnection";
import SongList from "./components/SongList";

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
    } catch (error) {
      alert(`Failed to connect: ${error}`);
    }
  };

  return (
    <div className="App">
      <OBSConnection onConnect={handleConnect} />
      {connected && <SongList />}
    </div>
  );
}

export default App;
