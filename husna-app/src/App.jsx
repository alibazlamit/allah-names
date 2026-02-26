import React, { useState } from 'react';
import LearnMode from './components/LearnMode';
import MemorizeMode from './components/MemorizeMode';
import HallOfFame from './components/HallOfFame';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('learn');

  return (
    <div className="app-container">
      <nav className="top-nav">
        <h1 className="logo">Husna</h1>
        <div className="nav-buttons">
          <button
            onClick={() => setCurrentView('learn')}
            className={currentView === 'learn' ? 'active' : ''}
          >
            Learn
          </button>
          <button
            onClick={() => setCurrentView('memorize')}
            className={currentView === 'memorize' ? 'active' : ''}
          >
            Memorize
          </button>
          <button
            onClick={() => setCurrentView('hall')}
            className={currentView === 'hall' ? 'active' : ''}
          >
            Hall of Fame
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'learn' && <LearnMode />}
        {currentView === 'memorize' && <MemorizeMode onComplete={() => setCurrentView('oath')} />}
        {currentView === 'hall' && <HallOfFame initialMode="leaderboard" />}
        {currentView === 'oath' && <HallOfFame initialMode="oath" onOathComplete={() => setCurrentView('hall')} />}
      </main>
    </div>
  );
}

export default App;
