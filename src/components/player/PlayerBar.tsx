import { usePlayerStore } from '../../state/playerScore';
import { audioService } from '../../services/audio';

export function PlayerBar() {
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const currentSongPath = usePlayerStore((state) => state.currentSongPath);

    const handplePlayPause = () => {
        if (isPlaying){
            audioService.pause();
        } else {
            audioService.play();
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file){
            audioService.loadSong(file);

            audioService.play();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px',
            backgroundColor: '#181818',
            color: 'white',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '1px solid #333'
        }}>

            <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                style={{ color: '#aaa'}}
            />

            <button 
                onClick={handplePlayPause}
                disabled={!currentSongPath}
                style={{
                    padding: '10px 30px',
                    cursor: currentSongPath ? 'pointer' : 'not-allowed',
                    backgroundColor: currentSongPath ? '#fff' : '#444',
                    color: currentSongPath ? '#000' : '#888',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                }}
            >
                {isPlaying ? '⏸ Pause' : '▶️ Play'}
            </button>
        </div>
    );

}