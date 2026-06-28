import { useLyricsStore } from '../../state/lyricsStore';

export function LyricsDisplay() {
    const lines= useLyricsStore((state) => state.lines);
    const activeLineIndex = useLyricsStore((state) => state.activeLineIndex);

    if(lines.length === 0) {
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
            <p>Trage un fisier .lrc aici pentru a adauga versuri</p>
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
      padding: '40px',
      width: '100%',
      marginBottom: '100px' 
    }}>
      {lines.map((line, index) => {
        const isActive = index === activeLineIndex;
        
        const distance = Math.abs(index - (activeLineIndex >= 0 ? activeLineIndex : 0));

        if (distance > 3) return null;

        return (
          <p key={index} style={{
            fontSize: isActive ? '48px' : '28px',
            color: isActive ? '#ffffff' : '#888888',
            opacity: isActive ? 1 : Math.max(0, 1 - (distance * 0.3)),
            transition: 'all 0.4s ease',
            textAlign: 'center',
            margin: isActive ? '20px 0' : '10px 0',
            fontWeight: isActive ? 'bold' : 'normal',
            textShadow: isActive ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
          }}>
            {line.text}
          </p>
        );
      })}
    </div>
  );
}