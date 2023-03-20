use setli::client_manager::ClientManager;

use obws::{Client, ClientConfig};
use serde::Deserialize;
use tauri::{api::config::Config, Command};

#[derive(Debug, Deserialize)]
pub struct ConnectToOBS {
  host: String,
  port: u16,
  password: String,
}

pub async fn connect_to_obs(
  connect_to_obs: ConnectToOBS,
  _config: Config,
  client_manager: State<ClientManager>,
) -> Result<(), String> {
  let config = ClientConfig {
    host: connect_to_obs.host,
    port: connect_to_obs.port,
    password: Some(connect_to_obs.password),
    ..Default::default()
  };

  let client = match Client::new(config).await {
    Ok(client) => client,
    Err(err) => return Err(err.to_string()),
  };

  client_manager.set_client(client);

  // ここでOBSへの操作が可能です
  // 例: let result = client.get_scene_list().await;

  Ok(())
}