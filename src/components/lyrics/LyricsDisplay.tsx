import { useLyricsStore } from '../../state/lyricsStore';

export function LyricsDisplay() {
  const lines = useLyricsStore((state) => state.lines);
  const activeLineIndex = useLyricsStore((state) => state.activeLineIndex);

  if (lines.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
        <p>Trage un fișier .lrc aici pentru a adăuga versuri</p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '20px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 10
    }}>
      {lines.map((line, index) => {
        const isActive = index === activeLineIndex;
        const distance = Math.abs(index - (activeLineIndex >= 0 ? activeLineIndex : 0));

        if (distance > 3) return null;

        return (
          <p key={index} style={{
            fontSize: isActive ? '42px' : '26px',
            color: isActive ? '#ffffff' : '#888888',
            opacity: isActive ? 1 : Math.max(0.1, 1 - (distance * 0.3)),
            transform: 'translateZ(0)', 
            
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            textAlign: 'center',
            margin: '10px 0',
            lineHeight: '1.3',
            fontWeight: 'bold',
            textShadow: isActive ? '0 0 25px rgba(255,255,255,0.5)' : 'none',
            
            width: '90%',
            maxWidth: '800px',
            wordWrap: 'break-word',
            willChange: 'font-size, opacity, text-shadow'
          }}>
            {line.text}
          </p>
        );
      })}
    </div>
  );
}