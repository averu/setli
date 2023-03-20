import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import type { Song } from "../types";

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    getSongs();
  }, []);

  async function getSongs() {
    try {
      const result = await invoke<Song[]>("get_songs");
      setSongs(result);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  }

  async function addSong(song: string) {
    try {
      await invoke("add_song", { song });
      getSongs();
    } catch (error) {
      console.error("Error adding song:", error);
    }
  }

  async function deleteSong(index: number) {
    try {
      await invoke("delete_song", { index });
      getSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  }

  return { songs, addSong, deleteSong };
}

export default useSongs;
