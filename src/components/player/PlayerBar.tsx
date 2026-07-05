import { usePlayerStore } from '../../state/playerStore';
import { audioService } from '../../services/audio';

const formatTime = (timeInSeconds: number) => {
    if(!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function PlayerBar() {
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const currentSongPath = usePlayerStore((state) => state.currentSongPath);
    const currentTime = usePlayerStore((state) => state.currentTime);
    const duration = usePlayerStore((state) => state.duration);
    const volume = usePlayerStore((state) => state.volume);

    const title = usePlayerStore((state) => state.title);
    const artist = usePlayerStore((state) => state.artist);

    const handlePlayPause = () => {
        if (isPlaying){
            audioService.pause();
        } else {
            audioService.play();
        }
    };


    const handleSeek= (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(event.target.value);
        audioService.seek(newTime);
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(event.target.value);
        audioService.setVolume(newVolume);
    };

    return (
    <div style={{
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0,
      padding: '15px 30px', 
      backgroundColor: '#181818', 
      color: 'white',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '15px',
      borderTop: '1px solid #333'
    }}>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '12px', color: '#aaa' }}>
        <span>{formatTime(currentTime)}</span>
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={currentTime} 
          onChange={handleSeek}
          disabled={!currentSongPath}
          style={{ flex: 1, cursor: currentSongPath ? 'pointer' : 'not-allowed' }}
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
        {/* Song info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {currentSongPath ? (
            <>
              <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'white' }}>
                {title || currentSongPath?.split(/[/\\]/).pop() || "Melodie"} 
              </span>
              <span style={{ fontSize: '13px', color: '#aaa' }}>
                {artist || "Unknown Artist"}
              </span>
            </>
          ) : (
            <span style={{ color: '#555', fontSize: '14px' }}>Nicio melodie</span>
          )}
        </div>

        {/* Play/Pause */}
        <button 
          onClick={handlePlayPause}
          disabled={!currentSongPath}
          style={{ 
            padding: '12px 40px', 
            cursor: currentSongPath ? 'pointer' : 'not-allowed',
            backgroundColor: currentSongPath ? '#fff' : '#444',
            color: currentSongPath ? '#000' : '#888',
            border: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶️ Play'}
        </button>

        {/* Volume control */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🔊</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            style={{ width: '100px', cursor: 'pointer' }}
          />
        </div>
      </div>
      
    </div>
  );
}