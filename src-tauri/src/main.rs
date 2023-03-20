use obws::{Client,Error};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Serialize, Deserialize, Clone)]
#[derive(Debug)]
struct Song {
  id: usize,
  title: String,
  artist: String,
}

#[derive(Debug, Deserialize)]
struct ConnectionInfo {
  host: String,
  port: u16,
  password: String,
}

#[derive(Default)]
struct AppState {
  client: Arc<Mutex<Option<Client>>>,
  songs: Arc<Mutex<Vec<Song>>>,
}

impl AppState {
  pub fn new() -> Self {
    Self {
      client: Arc::new(Mutex::new(None)),
      songs: Arc::new(Mutex::new(Vec::new())),
    }
  }
}

#[tauri::command]
fn get_songs(app_state: tauri::State<AppState>) -> Vec<Song> {
  let songs_guard = app_state.songs.lock().unwrap();
  let songs = &*songs_guard;
  // tauri::async_runtime::block_on(sync_to_obs(app_state.clone()));
  songs.clone()
}

#[tauri::command]
fn add_song(song: String, app_state: tauri::State<AppState>) {
  let mut songs = app_state.songs.lock().unwrap();
  let lenght = songs.len() + 1;
  songs.push(
    Song {
      id: lenght,
      title: song,
      artist: "".to_string(),
    }
  );
}

#[tauri::command]
fn delete_song(index: usize, app_state: tauri::State<AppState>) {
  let mut songs = app_state.songs.lock().unwrap();
  songs.remove(index);
}

#[tauri::command]
fn connect_to_obs(config: ConnectionInfo, app_state: tauri::State<AppState>) -> bool {
  let connected: Result<Client, Error> = tauri::async_runtime::block_on(connect_send(config));
  let mut client = app_state.client.lock().unwrap();

  match connected {
    Ok(result) => {
      *client = Some(result);
      true
    }
    Err(_e) => return false,
  }
}

// async fn sync_to_obs(app_state: tauri::State<'_, AppState>) -> () {
//   let client = app_state.client.lock().unwrap();
//   let scene_list = client.as_ref().unwrap().scenes().list().await;
//   let scene_items = client.as_ref().unwrap().scene_items().list("シーン").await;
//   let inputs = client.as_ref().unwrap().inputs().list(Some("text_gdiplus_v2")).await;
//   // let mut settings = client.as_ref().unwrap().inputs().default_settings("text_gdiplus_v2");
//   println!("{:#?}", scene_list);
//   println!("{:#?}", scene_items);
//   println!("{:#?}", inputs);
//   println!("{:#?}", inputs);
// }

async fn connect_send(config: ConnectionInfo) -> Result<Client, Error> {
  let client = Client::connect(config.host, config.port, Some(config.password)).await?;

  Ok(client)
}

fn main() {
  tauri::Builder::default()
    .manage(AppState::new())
    .invoke_handler(tauri::generate_handler![
      connect_to_obs,
      get_songs,
      add_song,
      delete_song,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}