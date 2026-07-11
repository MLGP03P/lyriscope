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

    const playNext = usePlayerStore((state) => state.playNext);
    const playPrevious = usePlayerStore((state) => state.playPrevious);

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
                {title || currentSongPath?.split(/[/\\]/).pop() || "Song"} 
              </span>
              <span style={{ fontSize: '13px', color: '#aaa' }}>
                {artist || "Unknown Artist"}
              </span>
            </>
          ) : (
            <span style={{ color: '#555', fontSize: '14px' }}>No song playing</span>
          )}
        </div>

        {/* Play/Pause */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={playPrevious}
            style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#aaa'}
            title="Previous Song"
          >
            ⏮
          </button>

          <button 
            onClick={isPlaying ? () => audioService.pause() : () => audioService.play()}
            style={{ 
              padding: '10px 30px', borderRadius: '25px', border: 'none', 
              backgroundColor: 'white', color: 'black', fontWeight: 'bold', 
              cursor: 'pointer', fontSize: '16px' 
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <button 
            onClick={playNext}
            style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#aaa'}
            title="Next Song"
          >
            ⏭
          </button>
        </div>

        {/* Volume control */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🔊</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              audioService.setVolume(newVolume);
              usePlayerStore.getState().setVolume(newVolume);
            }}
            style={{
              cursor: 'pointer',
              accentColor: '#7B2CFF',
              width: '100px'
            }}
          />
        </div>
      </div>
      
    </div>
  );
}