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

  useEffect(() => {
    // Ne abonăm la motorul nativ (care acum e pornit!)
    const unlistenPromise = getCurrentWindow().onDragDropEvent((event) => {
      // 1. Radar absolut: Printăm orice mișcare face mouse-ul tău cu fișierul
      console.log("🚨 EVENIMENT NATIV:", event.payload);
      
      const payload = event.payload as any;

      if (payload.type === 'enter' || payload.type === 'over') {
        setIsDragging(true);
      } else if (payload.type === 'leave') {
        setIsDragging(false);
      } else if (payload.type === 'drop') {
        setIsDragging(false);
        
        // 2. Aici se întâmplă magia!
        console.log("📥 FIȘIER ARUNCAT (Drop)! Date primite:", payload);

        const filePath = payload.paths?.[0];
        if (!filePath) {
            console.error("🔴 Eroare: Tauri nu a trimis calea fișierului!");
            return;
        }

        console.log("📂 Calea absolută extrasă este:", filePath);

        if (filePath.toLowerCase().endsWith('.lrc')) {
          invoke('read_lrc_file', { path: filePath })
            .then((text: any) => {
              const parsedLines = lyricsService.parseLRC(text);
              useLyricsStore.getState().setLyrics(parsedLines);
            })
            .catch((err) => console.error("🔴 Eroare versuri:", err));
        } else {
          audioService.loadSong(filePath);
          audioService.play();
          useLyricsStore.getState().resetLyrics();

          invoke('read_metadata', { path: filePath })
            .then((metadata: any) => {
              console.log("✅ Metadate primite de la Rust:", metadata);
              usePlayerStore.getState().setMetadata(metadata.title, metadata.artist);
            })
            .catch((err) => console.error("🔴 Eroare metadate Rust:", err));
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
        backgroundColor: isDragging ? '#1a1a1a' : '#0a0a0a', 
        color: 'white', 
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        border: isDragging ? '3px dashed #7B2CFF' : '3px solid transparent',
        boxSizing: 'border-box'
    }}>
      
      <LyricsSettings />
      <LyricsDisplay />

      {/*message for when the screen is empty*/}
      {!currentSongPath && recentSong && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '10px 20px', backgroundColor: '#181818', borderRadius: '8px', border: '1px solid #333', fontSize: '14px', color: '#aaa', zIndex: 10 }}>
          🎵 Last song played: <strong style={{ color: 'white' }}>{recentSong}</strong>
        </div>
      )}
      
      <PlayerBar />

    </div>
  );
}

export default App;