import { useEffect, useState } from 'react';
import { PlayerBar } from './components/player/PlayerBar';
import { audioService } from './services/audio';
import { usePlayerStore } from './state/playerStore';
import { LyricsDisplay } from './components/lyrics/LyricsDisplay';
import { lyricsService } from './services/lyrics';
import { useLyricsStore } from './state/lyricsStore';
import { LyricsSettings } from './components/lyrics/LyricsSettings';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const recentSong = usePlayerStore((state) => state.recentSong);
  const currentSongPath = usePlayerStore((state) => state.currentSongPath);
  const coverUrl = usePlayerStore((state) => state.coverUrl);

  useEffect(() => {
    const unlistenPromise = getCurrentWindow().onDragDropEvent((event) => {

      const payload = event.payload as any;

      if (payload.type === 'enter' || payload.type === 'over') {
        setIsDragging(true);
      } else if (payload.type === 'leave') {
        setIsDragging(false);
      } else if (payload.type === 'drop') {
        setIsDragging(false);
        

        const filePath = payload.paths?.[0];



        if (filePath.toLowerCase().endsWith('.lrc')) {
          invoke('read_lrc_file', { path: filePath })
            .then((text: any) => {
              const parsedLines = lyricsService.parseLRC(text);
              useLyricsStore.getState().setLyrics(parsedLines);
            })
            .catch((err) => console.error("🔴 lyrics error:", err));
        } else {
          audioService.loadSong(filePath);
          audioService.play();
          useLyricsStore.getState().resetLyrics();

          const tempId = filePath.split(/[/\\]/).pop() || "Song";
          useLyricsStore.getState().setCurrentSongId(tempId);

          invoke('read_metadata', { path: filePath })
            .then((metadata: any) => {
              console.log("✅ Metadata:", metadata);
              usePlayerStore.getState().setMetadata(metadata.title, metadata.artist);

              if (metadata.picture && metadata.mime_type) {
                const uint8Array = new Uint8Array(metadata.picture);
                const blob = new Blob([uint8Array], {type: metadata.mime_type});
                const url = URL.createObjectURL(blob);
                usePlayerStore.getState().setCoverUrl(url);
              } else {
                usePlayerStore.getState().setCoverUrl(null);
              }
              
              const finalId = `${metadata.artist || 'Unknown'} - ${metadata.title || tempId}`;
              useLyricsStore.getState().setCurrentSongId(finalId);
            })
            .catch((err) => console.error("🔴 Metadata error:", err));
        }
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return (
    <div style={{ 
        height: '100vh',
        width: '100%', 
        backgroundColor: isDragging ? '#1a1a1a' : '#0a0a0a', 
        color: 'white', 
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        border: isDragging ? '3px dashed #7B2CFF' : '3px solid transparent',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute',
        top: -50, left: -50, right: -50, bottom: -50, 
        backgroundImage: coverUrl ? `url(${coverUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(40px) brightness(0.25)',
        zIndex: 0, 
        transition: 'background-image 1s ease-in-out', 
      }} />
      
      <div style={{ 
        position: 'absolute', 
        top: '25px', 
        left: '30px', 
        zIndex: 50,
        pointerEvents: 'none'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '14px', 
          letterSpacing: '3px', 
          color: '#444',
          textTransform: 'uppercase',
          fontWeight: 'bold'
        }}>
          Lyriscope
        </h1>
      </div>

      <LyricsSettings />
      <LyricsDisplay />

      {!currentSongPath && recentSong && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '10px 20px', backgroundColor: '#181818', borderRadius: '8px', border: '1px solid #333', fontSize: '14px', color: '#aaa', zIndex: 10 }}>
          🎵 Last played song: <strong style={{ color: 'white' }}>{recentSong}</strong>
        </div>
      )}
      

      <div style={{ position:'relative', zIndex: 50, width: '100%'}}>
        <PlayerBar />
      </div>

    </div>
  );
}

export default App;