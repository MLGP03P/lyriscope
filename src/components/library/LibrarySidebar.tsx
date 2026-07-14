import { useState } from 'react';
import { usePlayerStore } from '../../state/playerStore';
import { useLyricsStore } from '../../state/lyricsStore';
import { useLibraryStore } from '../../state/libraryStore';
import { audioService } from '../../services/audio';
import { lyricsService } from '../../services/lyrics';
import { invoke } from '@tauri-apps/api/core';

export function LibrarySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const history = usePlayerStore((state) => state.history);
  const queue = usePlayerStore((state) => state.queue);
  const currentQueueIndex = usePlayerStore((state) => state.currentQueueIndex);
  
  const librarySongs = useLibraryStore((state) => state.songs);
  const isScanning = useLibraryStore((state) => state.isScanning);
  const setScanning = useLibraryStore((state) => state.setScanning);
  const addSongs = useLibraryStore((state) => state.addSongs);

  const clearLibrary = useLibraryStore((state) => state.clearLibrary);
  const [searchQuery, setSearchQuery] = useState('');

  

  const getFileName = (path: string) => path.split(/[/\\]/).pop() || "Unknown Audio";

  const playSong = (path: string, indexInQueue?: number) => {
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
        
        const finalId = `${metadata.artist || 'Unknown'} - ${metadata.title || tempId}`;
        useLyricsStore.getState().setCurrentSongId(finalId);

        usePlayerStore.getState().addToHistory({
          path,
          title: metadata.title || tempId,
          artist: metadata.artist || "Unknown Artist"
        });
      })
      .catch((err) => console.error("Metadata error:", err));

    const lrcPath = path.substring(0, path.lastIndexOf('.')) + '.lrc';
    invoke('read_lrc_file', { path: lrcPath })
      .then((text: any) => {
        const parsedLines = lyricsService.parseLRC(text);
        useLyricsStore.getState().setLyrics(parsedLines);
      })
      .catch(() => console.log("No automatic .lrc found."));
      
    setIsOpen(false);
  };

  const handleScanFolder = async () => {
    try {
      const selectedFolder = await invoke<string | null>('pick_folder');
      
      if (selectedFolder) {
        setScanning(true);
        console.log("Scanning directory:", selectedFolder);
        
        const songs = await invoke<any[]>('scan_folder', { folderPath: selectedFolder });
        
        addSongs(songs);
        console.log(`Found ${songs.length} audio files!`);
        setScanning(false);
      }
    } catch (err) {
      console.error("Failed to scan folder:", err);
      setScanning(false);
    }
  };

  const filteredLibrary = librarySongs.filter((song) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = song.title?.toLowerCase().includes(query);
    const artistMatch = song.artist?.toLowerCase().includes(query);
    const fileMatch = getFileName(song.path).toLowerCase().includes(query);
    return titleMatch || artistMatch || fileMatch;
  });

  const upcomingQueue = queue.slice(currentQueueIndex + 1);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute', top: '23px', left: '30px', zIndex: 60,
          background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', outline: 'none'
        }}
        title="Music Library"
      >
        ☰
      </button>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 90 }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, bottom: 0, left: isOpen ? 0 : '-340px',
        width: '340px', backgroundColor: '#111', zIndex: 100,
        boxShadow: isOpen ? '10px 0 30px rgba(0,0,0,0.8)' : 'none',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid #222'
      }}>
        
        <div style={{ padding: '25px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '14px', letterSpacing: '2px', color: '#fff', textTransform: 'uppercase' }}>
            Library
          </h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* SECTION 1: QUEUE */}
          <div>
            <h3 style={{ margin: '0 0 10px 5px', fontSize: '11px', letterSpacing: '1px', color: '#7B2CFF', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Up Next ({upcomingQueue.length})
            </h3>
            {upcomingQueue.length === 0 ? (
              <p style={{ color: '#444', margin: '5px 0 0 5px', fontSize: '13px' }}>Queue is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {queue.map((path, index) => {
                  if (index <= currentQueueIndex) return null;
                  return (
                    <div 
                      key={`queue-${index}`}
                      onClick={() => playSong(path, index)}
                      style={{ padding: '10px 12px', backgroundColor: '#16121e', border: '1px solid #251b35', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#251b35'; e.currentTarget.style.borderColor = '#7B2CFF'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#16121e'; e.currentTarget.style.borderColor = '#251b35'; }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getFileName(path)}
                      </div>
                      <span style={{ fontSize: '10px', color: '#7B2CFF', textTransform: 'uppercase', fontWeight: 'bold' }}>Queued</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 2: LOCAL LIBRARY */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 5px 10px 5px' }}>
              <h3 style={{ margin: 0, fontSize: '11px', letterSpacing: '1px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Local Files ({librarySongs.length})
              </h3>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Butonul de ștergere a librăriei */}
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your local library?')) {
                      clearLibrary();
                    }
                  }}
                  title="Clear Library"
                  style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                >
                  Clear
                </button>

                {/* Folder Scanning */}
                <button 
                  onClick={handleScanFolder}
                  disabled={isScanning}
                  style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: isScanning ? 'wait' : 'pointer' }}
                >
                  {isScanning ? 'Scanning...' : '+ Add Folder'}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            {librarySongs.length > 0 && (
              <input 
                type="text"
                placeholder="Search by title, artist or filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', marginBottom: '12px', boxSizing: 'border-box',
                  backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '6px',
                  color: 'white', fontSize: '12px', outline: 'none'
                }}
              />
            )}
            
            {filteredLibrary.length === 0 ? (
              <p style={{ color: '#444', margin: '5px 0 0 5px', fontSize: '13px' }}>
                {librarySongs.length === 0 ? "No local files scanned yet." : "No matching songs found."}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredLibrary.slice(0, 50).map((song, index) => (
                  <div 
                    key={`lib-${index}`}
                    onClick={() => playSong(song.path)}
                    style={{ padding: '10px 12px', backgroundColor: '#161616', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#161616'}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {song.title || getFileName(song.path)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {song.artist || "Unknown Artist"}
                    </div>
                  </div>
                ))}
                {filteredLibrary.length > 50 && (
                  <div style={{ textAlign: 'center', fontSize: '11px', color: '#666', marginTop: '10px' }}>
                    + {filteredLibrary.length - 50} more tracks
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 3: HISTORY */}
          <div>
            <h3 style={{ margin: '0 0 10px 5px', fontSize: '11px', letterSpacing: '1px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>
              History
            </h3>
            {history.length === 0 ? (
              <p style={{ color: '#444', margin: '5px 0 0 5px', fontSize: '13px' }}>History is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {history.map((item, index) => (
                  <div 
                    key={`hist-${index}`}
                    onClick={() => playSong(item.path)}
                    style={{ padding: '10px 12px', backgroundColor: '#161616', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s' }}
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