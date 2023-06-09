#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use obws::{Client, Error, requests};
use serde::{Deserialize, Serialize};
use serde_json::{self, Map, Value};
use std::sync::{Arc, Mutex};

#[derive(Serialize, Deserialize, Clone)]
#[derive(Debug)]
struct Song {
  id: usize,
  title: String,
  artist: String,
}

#[derive(Debug, Deserialize)]
struct Settings {
  scene_name: String,
  text_name: String,
  font_family: String,
  font_color: usize,
  outline: bool,
  outline_width: usize,
  outline_color: usize,
  line_breaks: usize,
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
  settings: Arc<Mutex<Option<Settings>>>,
}

impl AppState {
  pub fn new() -> Self {
    let settings = Some(Settings {
      scene_name: "シーン".to_string(),
      text_name: "setli".to_string(),
      font_family: "Arial".to_string(),
      font_color: 0,
      outline: true,
      outline_width: 1,
      outline_color: 0,
      line_breaks: 1,
    });
    Self {
      client: Arc::new(Mutex::new(None)),
      songs: Arc::new(Mutex::new(Vec::new())),
      settings: Arc::new(Mutex::new(settings)),
    }
  }
}

#[tauri::command]
fn get_songs(app_state: tauri::State<AppState>) -> Vec<Song> {
  tauri::async_runtime::block_on(sync_to_obs(app_state.clone()));
  let songs = app_state.songs.lock().unwrap();
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

#[tauri::command]
fn update_settings_to_obs(settings: Settings, app_state: tauri::State<AppState>) -> (){
  tauri::async_runtime::block_on(update_settings(settings, app_state.clone()));
  tauri::async_runtime::block_on(sync_to_obs(app_state.clone()));
}

#[tauri::command]
fn get_fonts() -> Result<Vec<String>, String> {
  let system_source = font_kit::source::SystemSource::new();
  let all_families = system_source.all_families().unwrap();
  Ok(all_families)
}

async fn sync_to_obs(app_state: tauri::State<'_, AppState>) -> () {
  let client = app_state.client.lock().unwrap();
  let songs_guard = app_state.songs.lock().unwrap();
  let songs = &*songs_guard;
  let state_settings_guard = app_state.settings.lock().unwrap();
  let state_settings = &*state_settings_guard.as_ref().unwrap();
  let text_name = &state_settings.text_name;
  let line_breaks = &state_settings.line_breaks;
  let song_titles = songs.iter().map(|song| song.title.clone()).collect::<Vec<String>>().join("\n".repeat(*line_breaks).as_str());
  drop(songs_guard);
  let settings = client.as_ref().unwrap().inputs().settings::<serde_json::Value>(text_name).await.unwrap();
  let mut new_settings = settings.settings.clone();
  new_settings.as_object_mut().unwrap().insert("text".to_string(), serde_json::Value::String(song_titles));

  let set_settings = requests::inputs::SetSettings {
    input: text_name,
    settings: &new_settings,
    overlay: None,
  };
  let result = client.as_ref().unwrap().inputs().set_settings(set_settings).await;

  if let Err(e) = result {
    eprintln!("Failed to set settings: {:?}", e);
  }
}

async fn connect_send(config: ConnectionInfo) -> Result<Client, Error> {
  let client = Client::connect(config.host, config.port, Some(config.password)).await?;

  Ok(client)
}

async fn update_settings(settings: Settings, app_state: tauri::State<'_, AppState>) -> () {
  let client = app_state.client.lock().unwrap();
  let mut settings_guard = app_state.settings.lock().unwrap();
  let inputs_settings = match client.as_ref().unwrap().inputs().settings::<serde_json::Value>(&settings.text_name.clone()).await {
    Ok(inputs_settings) => inputs_settings,
    Err(e) => {
      eprintln!("Error getting inputs settings: {:?}", e);
      return;
    }
  };

  let mut new_settings = inputs_settings.settings.clone();

  let mut additional_settings = Map::new();
  additional_settings.insert("color".to_string(), Value::Number(serde_json::Number::from(settings.font_color)));
  additional_settings.insert("font".to_string(), Value::Object({
    let mut font_map = Map::new();
    font_map.insert("face".to_string(), Value::String(settings.font_family.clone()));
    font_map.insert("size".to_string(), Value::Number(serde_json::Number::from(300)));
    font_map
  }));
  additional_settings.insert("outline".to_string(), Value::Bool(settings.outline.clone()));
  additional_settings.insert("outline_size".to_string(), Value::Number(serde_json::Number::from(settings.outline_width)));
  additional_settings.insert("outline_color".to_string(), Value::Number(serde_json::Number::from(settings.outline_color)));
  new_settings.as_object_mut().unwrap().extend(additional_settings);

  let set_settings = requests::inputs::SetSettings {
    input: &settings.text_name.clone(),
    settings: &new_settings,
    overlay: None,
  };

  *settings_guard = Some(settings);
  let result = client.as_ref().unwrap().inputs().set_settings(set_settings).await;

  if let Err(e) = result {
    eprintln!("Failed to set settings: {:?}", e);
  }
}

fn main() {
  tauri::Builder::default()
    .manage(AppState::new())
    .invoke_handler(tauri::generate_handler![
      connect_to_obs,
      get_songs,
      add_song,
      delete_song,
      update_settings_to_obs,
      get_fonts,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
