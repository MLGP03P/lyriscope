import { useState } from 'react';
import { PlayerBar } from './components/player/PlayerBar';
import { audioService } from './services/audio';

function App() {
  const [isDragging, setIsDragging] = useState(false);

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
      audioService.loadSong(file);
      audioService.play();
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
      <p style={{ color: '#888' }}>
        {/* dynamic text for drag and drop */}
        {isDragging ? 'Elibereaza melodia aici...' : 'Trage o melodie oriunde in fereastra pentru a o reda.'}
      </p>
      
      <PlayerBar />

    </div>
  );
}

export default App;