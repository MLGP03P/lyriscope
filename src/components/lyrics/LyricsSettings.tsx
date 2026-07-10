import { useState } from 'react';
import { useLyricsStore } from '../../state/lyricsStore';

export function LyricsSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const offsetMs = useLyricsStore((state) => state.offsetMs);
  const setOffsetMs = useLyricsStore((state) => state.setOffsetMs);
  
  const blurAmount = useLyricsStore((state) => state.blurAmount);
  const setBlurAmount = useLyricsStore((state) => state.setBlurAmount);

  return (
    <div style={{ position: 'relative' }}>
      {/* menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: isOpen ? '#7B2CFF' : '#aaa',
          fontSize: '24px',
          cursor: 'pointer',
          transition: 'color 0.2s',
          outline: 'none'
        }}
        title="Lyriscope settings"
      >
        ⚙️
      </button>

      {/* settings menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '0',
          backgroundColor: '#181818',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '20px',
          width: '260px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            Application Settings
          </h3>

          {/* lyrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>
              Lyrics Synchronization (Offset): {offsetMs > 0 ? `+${offsetMs}` : offsetMs} ms
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={() => setOffsetMs(offsetMs - 100)}
                style={{ padding: '6px 12px', backgroundColor: '#2a2a2a', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
              >- 100</button>
              
              <button 
                onClick={() => setOffsetMs(0)}
                style={{ flex: 1, padding: '6px', backgroundColor: 'transparent', border: '1px solid #444', color: '#888', borderRadius: '4px', cursor: 'pointer' }}
              >Reset</button>

              <button 
                onClick={() => setOffsetMs(offsetMs + 100)}
                style={{ padding: '6px 12px', backgroundColor: '#2a2a2a', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
              >+ 100</button>
            </div>
          </div>

          {/* blur menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              <span>Bacground Blur Amount</span>
              <span style={{ color: '#7B2CFF' }}>{blurAmount}px</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="120" 
              step="5"
              value={blurAmount}
              onChange={(e) => setBlurAmount(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#7B2CFF', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>
              (0 = Clear, 120 = Extreme)
            </span>
          </div>

        </div>
      )}
    </div>
  );
}