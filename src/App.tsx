import { useEffect, useState } from 'react';
import { PlayerBar } from './components/player/PlayerBar';
import { LyricsDisplay } from './components/lyrics/LyricsDisplay';
import { LyricsSettings } from './components/lyrics/LyricsSettings';
import { LibrarySidebar } from './components/library/LibrarySidebar';
import { audioService } from './services/audio';
import { usePlayerStore } from './state/playerStore';
import { useLyricsStore } from './state/lyricsStore';
import { lyricsService } from './services/lyrics';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const coverUrl = usePlayerStore((state) => state.coverUrl);
  const blurAmount = useLyricsStore((state) => state.blurAmount);

  useEffect(() => {
    const unlistenPromise = getCurrentWindow().onDragDropEvent((event) => {
      const payload = event.payload as any;

      if (payload.type === 'enter' || payload.type === 'over') {
        setIsDragging(true);
      } else if (payload.type === 'leave') {
        setIsDragging(false);
      } else if (payload.type === 'drop') {
        setIsDragging(false);
        
        const filePaths = payload.paths as string[];
        if (!filePaths || filePaths.length === 0) return;

        const lrcPaths = filePaths.filter(p => p.toLowerCase().endsWith('.lrc'));
        const audioPaths = filePaths.filter(p => !p.toLowerCase().endsWith('.lrc'));

        if (lrcPaths.length > 0 && audioPaths.length === 0) {
          const filePath = lrcPaths[0];
          console.log("📜 Lyric file uploaded:", filePath);
          
          invoke('read_lrc_file', { path: filePath })
            .then((text: any) => {
              const parsedLines = lyricsService.parseLRC(text);
              useLyricsStore.getState().setLyrics(parsedLines);

              const currentAudioPath = usePlayerStore.getState().currentSongPath;
              if (currentAudioPath && (currentAudioPath.includes('/') || currentAudioPath.includes('\\'))) {
                invoke('save_lrc_file', { songPath: currentAudioPath, lrcContent: text })
                .then(() => console.log("✅ Lyrics were successfully saved alongside the song."))
                .catch((err) => console.error("🔴 Error saving lyrics:", err));
              }
            })
            .catch((err) => console.error("🔴 Error reading lyrics:", err));
            
        } 
        else if (audioPaths.length > 0) {
          const state = usePlayerStore.getState();
          if (state.currentSongPath) {
            console.log(`🎵 Added to queue: ${audioPaths.length} songs.`);
            state.addToQueue(audioPaths);
            // add a small notification or visual feedback to indicate that songs were added to the queue
          } 
          else {
            console.log(`🎵 New playlist created! ${audioPaths.length} songs loaded.`);
            state.setQueue(audioPaths, 0);
            if ((window as any).triggerGlobalSongLoad) {
              (window as any).triggerGlobalSongLoad(audioPaths[0]);
            }
          }
        }
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const state = usePlayerStore.getState();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (state.currentSongPath) {
            if (state.isPlaying) {
              audioService.pause();
            } else {
              audioService.play();
            }
          }
          break;
          
        case 'ArrowRight':
          e.preventDefault();
          if (state.currentSongPath) {
            audioService.seek(Math.min(state.duration, state.currentTime + 5));
          }
          break;
          
        case 'ArrowLeft':
          e.preventDefault();
          if (state.currentSongPath) {
            audioService.seek(Math.max(0, state.currentTime - 5));
          }
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          const volUp = Math.min(1.0, state.volume + 0.1);
          audioService.setVolume(volUp);
          usePlayerStore.getState().setVolume(volUp);
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          const volDown = Math.max(0.0, state.volume - 0.1);
          audioService.setVolume(volDown);
          usePlayerStore.getState().setVolume(volDown);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  useEffect(() => {
    (window as any).triggerGlobalSongLoad = (filePath: string) => {
      console.log("🎵 Global song load triggered:", filePath);

      audioService.loadSong(filePath);
      audioService.play();
      useLyricsStore.getState().resetLyrics();

      const tempId = filePath.split(/[/\\]/).pop() || "Song"
      useLyricsStore.getState().setCurrentSongId(tempId);

      invoke('read_metadata', {path: filePath})
      .then((metadata: any) => {
        usePlayerStore.getState().setMetadata(metadata.title, metadata.artist);

        if(metadata.picture && metadata.mime_type) {
          const uint8Array = new Uint8Array(metadata.picture);
          const blob = new Blob([uint8Array], { type: metadata.mime_type });
          const url = URL.createObjectURL(blob);
          usePlayerStore.getState().setCoverUrl(url);
        } else {
          usePlayerStore.getState().setCoverUrl(null);
        }

        const finalId = `${metadata.artist || 'Unknown Artist'} - ${metadata.title || tempId}`;
        useLyricsStore.getState().setCurrentSongId(finalId);

        usePlayerStore.getState().addToHistory({
          path: filePath,
          title: metadata.title || tempId,
          artist: metadata.artist || "Unknown Artist",
        });
      })

      .catch((err) => console.error("🔴 Rust metadata error:", err));

      const lrcPath= filePath.substring(0, filePath.lastIndexOf('.')) + '.lrc';
      invoke('read_lrc_file', { path: lrcPath })
      .then((text: any) => {
        const parsedLines = lyricsService.parseLRC(text);
        useLyricsStore.getState().setLyrics(parsedLines);
      })
      .catch((err) => console.error("🔴 Rust LRC error:", err));
    };
    return() => {
      delete (window as any).triggerGlobalSongLoad;
    };
  }, []);

  return (
    <div style={{ 
        height: '100vh', 
        width: '100%', 
        overflow: 'hidden', 
        margin: 0, 
        padding: 0,
        backgroundColor: '#0a0a0a', 
        color: 'white', 
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        outline: isDragging ? '3px dashed #7B2CFF' : 'none',
        outlineOffset: '-3px',
        boxSizing: 'border-box',
        position: 'relative'
    }}>
      
      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
        body {
          background-color: #0a0a0a;
          margin: 0;
          overflow: hidden;
        }
      `}</style>

      {/* Album Art */}
      <div style={{
        position: 'absolute', top: -50, left: -50, right: -50, bottom: -50,
        backgroundImage: coverUrl ? `url(${coverUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: `blur(${blurAmount}px) brightness(0.25)`, 
        zIndex: 0, 
        transition: 'background-image 1s ease-in-out',
        pointerEvents: 'none', 
      }} />

      <LibrarySidebar />

      {/* Title */}
      <div style={{ position: 'absolute', top: '33px', left: '70px', zIndex: 50, pointerEvents: 'none' }}>
        <h1 style={{ margin: 0, fontSize: '14px', letterSpacing: '3px', color: '#444', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Lyriscope
        </h1>
      </div>

      {/* Lyrics Settings */}
      <div style={{ position: 'absolute', top: '-4px', right: '30px', zIndex: 60 }}>
        <LyricsSettings />
      </div>

      <LyricsDisplay />
      
      {/* Buttons */}
      <div style={{ position: 'relative', zIndex: 9999, width: '100%', flexShrink: 0, pointerEvents: 'auto' }}>
        <PlayerBar />
      </div>

    </div>
  );
}

export default App;