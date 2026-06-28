import { PlayerBar } from './components/player/PlayerBar';
import { audioService } from './services/audio';

function App() {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (file) {
      audioService.loadSong(file);
      audioService.play();
    }
  };
  
  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ 
        height: '100vh', 
        backgroundColor: '#0a0a0a', 
        color: 'white', 
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s'
    }}>
      
      <h1>Lyriscope</h1>
      <p style={{ color: '#888' }}>
        Trage o melodie oriunde în fereastră pentru a o reda.
      </p>
      
      <PlayerBar />

    </div>
  );
}

export default App;