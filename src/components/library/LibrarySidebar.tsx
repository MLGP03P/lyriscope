import { useState } from 'react';
import { usePlayerStore } from '../../state/playerStore';
import { useLyricsStore } from '../../state/lyricsStore';
import { audioService } from '../../services/audio';
import { invoke } from '@tauri-apps/api/core';
import { lyricsService } from '../../services/lyrics';

export function LibrarySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const history = usePlayerStore((state) => state.history);

  const playFromHistory = (path: string) => {
    audioService.loadSong(path);
    audioService.play();
    useLyricsStore.getState().resetLyrics();

    const tempId = path.split(/[/\\]/).pop() || "Melodie";

    // 1. Cerem Metadatele (Codul pe care îl aveai deja)
    invoke('read_metadata', { path })
      .then((metadata: any) => {
        usePlayerStore.getState().setMetadata(metadata.title, metadata.artist);
        
        if (metadata.picture && metadata.mime_type) {
          const uint8Array = new Uint8Array(metadata.picture);
          const blob = new Blob([uint8Array], { type: metadata.mime_type });
          const url = URL.createObjectURL(blob);
          usePlayerStore.getState().setCoverUrl(url);
        } else {
          usePlayerStore.getState().setCoverUrl(null);
        }
        
        const finalId = `${metadata.artist || 'Unknown Artist'} - ${metadata.title || tempId}`;
        useLyricsStore.getState().setCurrentSongId(finalId);
      })
      .catch((err) => console.error("History metadata error:", err));

    const lrcPath = path.substring(0, path.lastIndexOf('.')) + '.lrc';
    
    invoke('read_lrc_file', { path: lrcPath })
      .then((text: any) => {
        const parsedLines = lyricsService.parseLRC(text);
        useLyricsStore.getState().setLyrics(parsedLines);
      })
      .catch(() => {
        console.log("Could not find an associated .lrc file.");
      });
    
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute', top: '23px', left: '30px', zIndex: 60,
          background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', outline: 'none'
        }}
        title="Library"
      >
        ☰
      </button>

      {/* Menu Body */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 90 }}
        />
      )}

      {/* Side Panel that Slides In */}
      <div style={{
        position: 'fixed', top: 0, bottom: 0, left: isOpen ? 0 : '-300px',
        width: '300px', backgroundColor: '#111', zIndex: 100,
        boxShadow: isOpen ? '10px 0 30px rgba(0,0,0,0.8)' : 'none',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid #222'
      }}>
        
        <div style={{ padding: '25px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '16px', letterSpacing: '2px', color: '#fff', textTransform: 'uppercase' }}>
            History
          </h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {history.length === 0 ? (
            <p style={{ color: '#555', textAlign: 'center', marginTop: '30px', fontSize: '14px' }}>You haven't played any songs yet.</p>
          ) : (
            history.map((item, index) => (
              <div 
                key={index}
                onClick={() => playFromHistory(item.path)}
                style={{
                  padding: '12px 15px', margin: '5px 0', backgroundColor: '#1a1a1a',
                  borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              >
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  {item.artist}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}