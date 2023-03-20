import React, { useState } from "react";

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
    <div>
      <input value={host} onChange={(e) => setHost(e.target.value)} />
      <input value={port} onChange={(e) => setPort(Number(e.target.value))} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

export default OBSConnection;
