use obws::Client;
use std::sync::{Arc, Mutex};

pub struct ClientManager {
  client: Arc<Mutex<Option<Client>>>,
}

impl ClientManager {
  pub fn new() -> Self {
    Self {
      client: Arc::new(Mutex::new(None)),
    }
  }

  pub fn set_client(&self, client: Client) {
    let mut client_guard = self.client.lock().unwrap();
    *client_guard = Some(client);
  }

  pub fn get_client(&self) -> Arc<Mutex<Option<Client>>> {
    self.client.clone()
  }
}