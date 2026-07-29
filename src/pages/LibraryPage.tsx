import { useState } from 'react';
import { useLibraryStore } from '../state/libraryStore';
import { usePlayerStore } from '../state/playerStore';
import { useLyricsStore } from '../state/lyricsStore';
import { useUiStore } from '../state/uiStore';
import { audioService } from '../services/audio';
import { lyricsService } from '../services/lyrics';
import { invoke } from '@tauri-apps/api/core';

export function LibraryPage() {
  const librarySongs = useLibraryStore((state) => state.songs);
  const isScanning = useLibraryStore((state) => state.isScanning);
  const setScanning = useLibraryStore((state) => state.setScanning);
  const addSongs = useLibraryStore((state) => state.addSongs);
  const clearLibrary = useLibraryStore((state) => state.clearLibrary);
  const setCurrentPage = useUiStore((state) => state.setCurrentPage);

  const [searchQuery, setSearchQuery] = useState('');

  const getFileName = (path: string) => path.split(/[/\\]/).pop() || "Unknown Audio";

  const playSong = async (path: string) => {
    audioService.loadSong(path);
    audioService.play();
    useLyricsStore.getState().resetLyrics();

    const tempId = getFileName(path);
    let title = tempId;
    let artist = "Unknown Artist";

    try {
      const metadata: any = await invoke('read_metadata', { path });
    
      title = metadata.title || tempId;
      artist = metadata.artist || "Unknown Artist";
      
      usePlayerStore.getState().setMetadata(title, artist);
      
      if (metadata.picture && metadata.mime_type) {
        const uint8Array = new Uint8Array(metadata.picture);
        const blob = new Blob([uint8Array], { type: metadata.mime_type });
        const url = URL.createObjectURL(blob);
        usePlayerStore.getState().setCoverUrl(url);
      } else {
        usePlayerStore.getState().setCoverUrl(null);
      }
    } catch (metaError) {
      console.warn("Metadatele or cover are missing.", metaError);
      usePlayerStore.getState().setMetadata(title, artist);
      usePlayerStore.getState().setCoverUrl(null);
    }

    const finalId = `${artist} - ${title}`;
    useLyricsStore.getState().setCurrentSongId(finalId);
    usePlayerStore.getState().addToHistory({ path, title, artist });

    const lrcPath = path.substring(0, path.lastIndexOf('.')) + '.lrc';
    
    try {
      const localText: any = await invoke('read_lrc_file', { path: lrcPath });
      const parsedLines = lyricsService.parseLRC(localText);
      useLyricsStore.getState().setLyrics(parsedLines);
    } catch (localError) {
      console.log(`No local .lrc found. Searching online for: ${title} - ${artist}`);
      
      try {
        const onlineText: any = await invoke('fetch_online_lyrics', { title, artist });
        const parsedLines = lyricsService.parseLRC(onlineText);
        useLyricsStore.getState().setLyrics(parsedLines);
        console.log("Online lyrics successfully loaded!");
      } catch (onlineError) {
        console.log("No lyrics found online either:", onlineError);
      }
    }
  };

  const handleScanFolder = async () => {
    try {
      const selectedFolder = await invoke<string | null>('pick_folder');
      if (selectedFolder) {
        setScanning(true);
        const songs = await invoke<any[]>('scan_folder', { folderPath: selectedFolder });
        addSongs(songs);
        setScanning(false);
      }
    } catch (err) {
      console.error("Failed to scan folder:", err);
      setScanning(false);
    }
  };


  const [sortBy, setSortBy] = useState('alphabetical');


  const processedLibrary = [...librarySongs]
    .filter((song) => {
      const query = searchQuery.toLowerCase();
      return (
        song.title?.toLowerCase().includes(query) ||
        song.artist?.toLowerCase().includes(query) ||
        getFileName(song.path).toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'alphabetical') {
        const titleA = a.title || getFileName(a.path);
        const titleB = b.title || getFileName(b.path);
        return titleA.localeCompare(titleB);
      } 
      else if (sortBy === 'artist') {
        const artistA = a.artist || "Unknown Artist";
        const artistB = b.artist || "Unknown Artist";
        return artistA.localeCompare(artistB);
      } 
      else if (sortBy === 'duration') {
        const durA = a.duration || 0;
        const durB = b.duration || 0;
        return durB - durA; 
      }
      return 0;
    });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 80px', overflowY: 'auto', zIndex: 10, width: '100%', boxSizing: 'border-box' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '42px', fontWeight: 'bold', color: 'white' }}>Local Library</h1>
          <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '16px' }}>{librarySongs.length} tracks available</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentPage('player')}
            style={{ background: 'transparent', border: '1px solid #7B2CFF', color: '#7B2CFF', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ← Back to Player
          </button>
          <button 
            onClick={() => { if (window.confirm('Are you sure you want to clear your local library?')) clearLibrary(); }}
            style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Library
          </button>
          <button 
            onClick={handleScanFolder}
            disabled={isScanning}
            style={{ background: '#7B2CFF', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: isScanning ? 'wait' : 'pointer', fontWeight: 'bold' }}
          >
            {isScanning ? 'Scanning...' : '+ Add Folder'}
          </button>
        </div>
      </div>

      {/* CONTROL PANEL */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <input 
          type="text"
          placeholder="Search by title, artist or filename..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1, padding: '18px 24px', boxSizing: 'border-box',
            backgroundColor: 'rgba(20, 20, 20, 0.7)', border: '1px solid #333', borderRadius: '12px',
            color: 'white', fontSize: '16px', outline: 'none'
          }}
        />
        
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '0 20px', backgroundColor: 'rgba(20, 20, 20, 0.7)', 
            border: '1px solid #333', borderRadius: '12px', color: 'white', 
            fontSize: '14px', outline: 'none', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          <option value="alphabetical">Sort by: Title</option>
          <option value="artist">Sort by: Artist</option>
          <option value="duration">Sort by: Duration</option>
        </select>
      </div>

      {/* SONGS GRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '100px' }}>
        {processedLibrary.map((song, index) => (
          <div 
            key={`lib-${index}`}
            onClick={() => playSong(song.path)}
            style={{ 
              display: 'flex', alignItems: 'center', padding: '15px 25px', 
              backgroundColor: 'rgba(20, 20, 20, 0.5)', border: '1px solid transparent', 
              borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' 
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(40, 40, 40, 0.7)'; e.currentTarget.style.borderColor = '#7B2CFF'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.5)'; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>
                {song.title || getFileName(song.path)}
              </div>
              <div style={{ fontSize: '14px', color: '#aaa', marginTop: '4px' }}>
                {song.artist || "Unknown Artist"}
              </div>
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>
              {song.album || ""}
            </div>
          </div>
        ))}
        {processedLibrary.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50px', fontSize: '18px' }}>
            No songs found.
          </div>
        )}
      </div>
    </div>
  );
}