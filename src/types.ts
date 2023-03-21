export interface Song {
  id: number;
  title: string;
  artist: string;
}

export type Settings = {
  color: string;
  outline: boolean;
  outline_width: number;
  scene: string;
  name: string;
};
