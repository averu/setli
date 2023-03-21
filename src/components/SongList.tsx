import React, { useState } from "react";
import { useSongs } from "../hooks/useSongs";
import styles from "./SongList.module.css";
import type { Song } from "../types";

function SongList() {
  const { songs, addSong, deleteSong } = useSongs();
  const [newSong, setNewSong] = useState("");

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSong.trim()) {
      addSong(newSong);
      setNewSong("");
    }
  };

  return (
    <div className={styles.songList}>
      <form onSubmit={handleAddSong}>
        <input
          type="text"
          name="song"
          value={newSong}
          onChange={(e) => setNewSong(e.target.value)}
        />
        <button type="submit">+</button>
      </form>
      <ul>
        {songs.map((song: Song, index: number) => (
          <li key={index}>
            {song.title}
            <button onClick={() => deleteSong(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongList;
