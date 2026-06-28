import { useState } from 'react';
import { PlayerBar } from './components/player/PlayerBar';
import { audioService } from './services/audio';
import { usePlayerStore } from './state/playerScore';
import { LyricsDisplay } from './components/lyrics/LyricsDisplay';
import { lyricsService } from './services/lyrics';
import { useLyricsStore } from './state/lyricsStore';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  
  const recentSong = usePlayerStore((state) => state.recentSong);
  const currentSongPath = usePlayerStore((state) => state.currentSongPath);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  // drop function
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if(file.name.toLowerCase().endsWith('.lrc')){
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const parsedLines = lyricsService.parseLRC(text);
          useLyricsStore.getState().setLyrics(parsedLines);
        };
        reader.readAsText(file);
      } else{
        audioService.loadSong(file);
        audioService.play();
        useLyricsStore.getState().resetLyrics();
      }
    }
  };

  return (
    <div 
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{ 
        height: '100vh', 
        backgroundColor: isDragging ? '#1a1a1a' : '#0a0a0a', 
        color: 'white', 
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        border: isDragging ? '3px dashed #7B2CFF' : '3px solid transparent',
        boxSizing: 'border-box'
    }}>
      
      <h1>Lyriscope</h1>
      <p style={{ color: '#888', marginBottom: '10px' }}>
        {isDragging ? 'Elibereaza melodia aici...' : 'Trage o melodie oriunde in fereastra pentru a o reda.'}
      </p>

      {/* shows the last song if no song is currently playing */}
      {!currentSongPath && recentSong && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#181818', 
          borderRadius: '8px',
          border: '1px solid #333',
          fontSize: '14px',
          color: '#aaa'
        }}>
          🎵 Last played song: <strong style={{ color: 'white' }}>{recentSong}</strong>
        </div>
      )}
      
      <LyricsDisplay />
      
      <PlayerBar />

    </div>
  );
}

export default App;