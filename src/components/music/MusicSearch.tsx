"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MyTrackObjectSimplified extends SpotifyApi.TrackObjectSimplified {
  album: {
    images: {
      url: string;
    }[];
  };
}
interface MusicSearchProps {
  onSelect: (track: MyTrackObjectSimplified | null) => void;
  selectedTrack: MyTrackObjectSimplified | null;
}

export default function MusicSearch({ onSelect, selectedTrack }: MusicSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [trackList, setTrackList] = useState<MyTrackObjectSimplified[]>([]);

  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setTrackList(data);
    } catch (error) {
      console.error("Error searching tracks:", error);
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLButtonElement>, track: MyTrackObjectSimplified) => {
    e.preventDefault();
    onSelect(track);
  };

  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="曲名を入力"
        />
        <Button 
          type="button"
          onClick={handleSearch}
        >
          検索
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {trackList.map((track) => (
          <button 
            key={track.id} 
            type="button"
            onClick={(e) => handleTrackClick(e, track)} 
            className="p-2 flex gap-2 flex-col"
            style={{
              backgroundColor: selectedTrack?.id === track.id ? "#FFF" : "#000",
              color: selectedTrack?.id === track.id ? "#000" : "#FFF",
              border: selectedTrack?.id === track.id ? "1px solid #000" : "1px solid #FFF",
              borderRadius: "10px",
            }}
          >
            <h3>曲名:{track.name}</h3>
            <p>アーティスト:{track.artists[0].name}</p>
            {track?.album?.images[0]?.url && (
              <Image
                src={track?.album?.images[0]?.url} 
                alt={track.name} 
                width={300} 
                height={300} 
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}