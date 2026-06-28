import { useState } from 'react';
import { useLyricsStore } from '../../state/lyricsStore';

export function LyricsSettings() {
  const [isOpen, setIsOpen] = useState(false);
  
  const offsetMs = useLyricsStore((state) => state.offsetMs);
  const setOffsetMs = useLyricsStore((state) => state.setOffsetMs);

  const adjustOffset = (amount: number) => {
    setOffsetMs(offsetMs + amount);
  };

  return (
    <div style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 100 }}>
      
      {/* settings bttn */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none', 
          border: 'none', 
          color: isOpen ? '#ffffff' : '#555555',
          fontSize: '24px', 
          cursor: 'pointer', 
          transition: 'color 0.2s',
          outline: 'none'
        }}
        title="Setări Versuri"
      >
        ⚙️
      </button>

      {/* menu body */}
      {isOpen && (
        <div style={{
          position: 'absolute', 
          top: '40px', 
          right: '0',
          backgroundColor: '#181818', 
          border: '1px solid #333',
          borderRadius: '12px', 
          padding: '20px',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          width: '240px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)'
        }}>
          
          <h3 style={{ margin: 0, fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Synchronization
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => adjustOffset(-100)} style={buttonStyle}>-100</button>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
              {offsetMs > 0 ? `+${offsetMs}` : offsetMs} ms
            </span>
            <button onClick={() => adjustOffset(100)} style={buttonStyle}>+100</button>
          </div>

          <button onClick={() => setOffsetMs(0)} style={{...buttonStyle, width: '100%', backgroundColor: '#222'}}>
            Reset Offset
          </button>
          
        </div>
      )}
    </div>
  );
}

//button template
const buttonStyle = {
  backgroundColor: '#333', 
  color: 'white', 
  border: 'none',
  padding: '8px 15px', 
  borderRadius: '6px', 
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.2s'
};