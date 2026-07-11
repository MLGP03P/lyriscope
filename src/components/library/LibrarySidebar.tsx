import { useState } from 'react';
import { usePlayerStore } from '../../state/playerStore';
import { useLyricsStore } from '../../state/lyricsStore';
import { audioService } from '../../services/audio';
import { lyricsService } from '../../services/lyrics';
import { invoke } from '@tauri-apps/api/core';

export function LibrarySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const history = usePlayerStore((state) => state.history);
  
  const queue = usePlayerStore((state) => state.queue);
  const currentQueueIndex = usePlayerStore((state) => state.currentQueueIndex);
  const getFileName = (path: string) => {
    return path.split(/[/\\]/).pop() || "Melodie";
  };

  const playFromHistoryOrQueue = (path: string, indexInQueue?: number) => {
    audioService.loadSong(path);
    audioService.play();
    useLyricsStore.getState().resetLyrics();

    const tempId = getFileName(path);
    if (indexInQueue !== undefined) {
      usePlayerStore.setState({ currentQueueIndex: indexInQueue });
    }

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

        // Adăugăm în istoric
        usePlayerStore.getState().addToHistory({
          path,
          title: metadata.title || tempId,
          artist: metadata.artist || "Unknown Artist"
        });
      })
      .catch((err) => console.error("Error reading metadata:", err));

    const lrcPath = path.substring(0, path.lastIndexOf('.')) + '.lrc';
    invoke('read_lrc_file', { path: lrcPath })
      .then((text: any) => {
        const parsedLines = lyricsService.parseLRC(text);
        useLyricsStore.getState().setLyrics(parsedLines);
      })
      .catch(() => console.log("No .lrc file found automatically."));
      
    setIsOpen(false);
  };

  const upcomingQueue = queue.slice(currentQueueIndex + 1);

  return (
    <>
      {/* button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute', top: '23px', left: '30px', zIndex: 60,
          background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', outline: 'none'
        }}
        title="Queue and History"
      >
        ☰
      </button>

      {/* background */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 90 }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, bottom: 0, left: isOpen ? 0 : '-320px',
        width: '320px', backgroundColor: '#111', zIndex: 100,
        boxShadow: isOpen ? '10px 0 30px rgba(0,0,0,0.8)' : 'none',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid #222'
      }}>
        
        <div style={{ padding: '25px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '14px', letterSpacing: '2px', color: '#fff', textTransform: 'uppercase' }}>
            Queue and History
          </h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* content section */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Up next (queue) */}
          <div>
            <h3 style={{ margin: '0 0 10px 5px', fontSize: '11px', letterSpacing: '1px', color: '#7B2CFF', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Up Next ({upcomingQueue.length})
            </h3>
            {upcomingQueue.length === 0 ? (
              <p style={{ color: '#444', margin: '5px 0 0 5px', fontSize: '13px' }}>No songs in queue.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {queue.map((path, index) => {
                  if (index <= currentQueueIndex) return null;
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => playFromHistoryOrQueue(path, index)}
                      style={{
                        padding: '10px 12px', backgroundColor: '#16121e', border: '1px solid #251b35',
                        borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#251b35';
                        e.currentTarget.style.borderColor = '#7B2CFF';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#16121e';
                        e.currentTarget.style.borderColor = '#251b35';
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getFileName(path)}
                      </div>
                      <span style={{ fontSize: '10px', color: '#7B2CFF', textTransform: 'uppercase', fontWeight: 'bold' }}>Up Next</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* history section */}
          <div>
            <h3 style={{ margin: '0 0 10px 5px', fontSize: '11px', letterSpacing: '1px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>
              History
            </h3>
            {history.length === 0 ? (
              <p style={{ color: '#444', margin: '5px 0 0 5px', fontSize: '13px' }}>No song in history.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {history.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => playFromHistoryOrQueue(item.path)}
                    style={{
                      padding: '10px 12px', backgroundColor: '#161616',
                      borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#161616'}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                      {item.artist}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}