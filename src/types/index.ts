export interface ProfileType {
  id: string;
  name: string;
  introduce: string | null;
  avatar_url: string | null;
};

export interface BlogType {
  id: string;
  title: string;
  content: string;
  user_id: string;
  image_url: string | null;
  spotify_track_id: string | null;
  spotify_track_name: string | null;
  spotify_track_artist: string | null;
  spotify_track_image: string | null;
  spotify_track_preview: string | null;
  updated_at: string;
  created_at: string;
};