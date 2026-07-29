import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../state/playerStore';
import { useLyricsStore, LyricLine } from '../../state/lyricsStore';
import { audioService } from '../../services/audio';


export function LyricsDisplay() {
  const currentTime = usePlayerStore((state) => state.currentTime);
  
  const lines = useLyricsStore((state) => state.lines);
  const offsetMs = useLyricsStore((state) => state.offsetMs);
  const fontSizeModifier = useLyricsStore((state) => state.fontSizeModifier);
  
  const activeLineRef = useRef<HTMLDivElement>(null);

  const effectiveTime = currentTime + (offsetMs / 1000);
  const activeIndex = lines.findIndex((line: LyricLine, index: number) => {
    const nextLine = lines[index + 1];
    if (nextLine) {
      return effectiveTime >= line.time && effectiveTime < nextLine.time;
    }
    return effectiveTime >= line.time;
  });

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '50vh 20px', textAlign: 'center', scrollbarWidth: 'none' }}>
      {lines.length > 0 ? (
        lines.map((line: LyricLine, index: number) => {
          const isActive = index === activeIndex;
          
          return (
            <div
              key={index}
              ref={isActive ? activeLineRef : null}
              style={{
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fontSize: isActive ? `${38 * fontSizeModifier}px` : `${28 * fontSizeModifier}px`,
                fontWeight: isActive ? 'bold' : '600',
                color: '#ffffff',
                opacity: isActive ? 1 : 0.4,
                
                textShadow: isActive 
                  ? '0px 0px 20px rgba(255, 255, 255, 0.7)' 
                  : '0px 2px 4px rgba(0, 0, 0, 0.5)',
                
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                margin: isActive ? '30px 0' : '15px 0',
                
                cursor: 'pointer',
              }}
              onClick={() => {
                const exactAudioTime = line.time - (offsetMs / 1000);

                const safeTime = Math.max(0, exactAudioTime);
                audioService.seek(safeTime);
              }}
            >
              {line.text}
            </div>
          );
        })
      ) : (
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px', textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}>
          Searching for lyrics...
        </div>
      )}
    </div>
  );
}