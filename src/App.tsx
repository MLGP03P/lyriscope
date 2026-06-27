import { PlayerBar } from './components/player/PlayerBar';

function App() {
  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      <h1>Lyriscope</h1>
      <p style={{ color: '#888' }}>
        Alege o melodie locală pentru a o reda.
      </p>
      

      <PlayerBar />

    </div>
  );
}

export default App;