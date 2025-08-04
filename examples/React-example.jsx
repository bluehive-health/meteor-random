// React-example.jsx - Example React component using @bluehive/random
import React, { useState, useEffect } from 'react';
import { Random } from '@bluehive/random';

// Custom hook for random generation
function useRandom() {
  return {
    generateId: (length) => Random.id(length),
    generateSecret: (length) => Random.secret(length),
    generateNumber: () => Random.fraction(),
    generateHex: (digits) => Random.hexString(digits),
    randomChoice: (array) => Random.choice(array)
  };
}

// User Profile component with random avatar and ID
function UserProfile() {
  const [userId, setUserId] = useState('');
  const [avatarColor, setAvatarColor] = useState('');
  const random = useRandom();
  
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
  
  useEffect(() => {
    setUserId(random.generateId(12));
    setAvatarColor(random.randomChoice(colors));
  }, []);
  
  const regenerateUser = () => {
    setUserId(random.generateId(12));
    setAvatarColor(random.randomChoice(colors));
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold`}>
          {userId.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold">Random User</h3>
          <p className="text-gray-600 text-sm font-mono">ID: {userId}</p>
        </div>
      </div>
      <button 
        onClick={regenerateUser}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate New User
      </button>
    </div>
  );
}

// API Key Generator component
function ApiKeyGenerator() {
  const [apiKey, setApiKey] = useState('');
  const [keyLength, setKeyLength] = useState(32);
  const random = useRandom();
  
  const generateKey = () => {
    setApiKey(random.generateSecret(keyLength));
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">API Key Generator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Length: {keyLength}
          </label>
          <input
            type="range"
            min="16"
            max="64"
            value={keyLength}
            onChange={(e) => setKeyLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <button
          onClick={generateKey}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Generate API Key
        </button>
        
        {apiKey && (
          <div className="space-y-2">
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">
              {apiKey}
            </div>
            <button
              onClick={copyToClipboard}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Random Color Palette Generator
function ColorPaletteGenerator() {
  const [colors, setColors] = useState([]);
  const random = useRandom();
  
  const generatePalette = () => {
    const newColors = Array.from({ length: 5 }, () => ({
      hex: '#' + random.generateHex(6),
      id: random.generateId(8)
    }));
    setColors(newColors);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Random Color Palette</h3>
      
      <button
        onClick={generatePalette}
        className="mb-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Generate Palette
      </button>
      
      {colors.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <div key={color.id} className="text-center">
              <div 
                className="w-full h-16 rounded-lg mb-2 border"
                style={{ backgroundColor: color.hex }}
              ></div>
              <div className="text-xs font-mono text-gray-600">
                {color.hex}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Game Score Generator
function GameScoreBoard() {
  const [players, setPlayers] = useState([]);
  const random = useRandom();
  
  const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  
  const generateScores = () => {
    const numPlayers = 3 + Math.floor(random.generateNumber() * 3); // 3-5 players
    const selectedPlayers = [];
    const usedNames = [];
    
    for (let i = 0; i < numPlayers; i++) {
      let name;
      do {
        name = random.randomChoice(playerNames);
      } while (usedNames.includes(name));
      usedNames.push(name);
      
      selectedPlayers.push({
        id: random.generateId(6),
        name,
        score: Math.floor(random.generateNumber() * 10000),
        level: Math.floor(random.generateNumber() * 50) + 1
      });
    }
    
    // Sort by score (highest first)
    selectedPlayers.sort((a, b) => b.score - a.score);
    setPlayers(selectedPlayers);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">🎮 Random Game Scores</h3>
      
      <button
        onClick={generateScores}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Generate Random Scores
      </button>
      
      {players.length > 0 && (
        <div className="space-y-2">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                <span className="font-semibold">{player.name}</span>
                <span className="text-sm text-gray-500">Level {player.level}</span>
              </div>
              <span className="font-mono text-lg font-bold text-blue-600">
                {player.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main App component
function RandomExampleApp() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            @bluehive/random + React
          </h1>
          <p className="text-gray-600">
            Interactive examples showing how to integrate cryptographically secure random generation in React apps
          </p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2">
          <UserProfile />
          <ApiKeyGenerator />
          <ColorPaletteGenerator />
          <GameScoreBoard />
        </div>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Install: <code className="bg-gray-200 px-2 py-1 rounded">npm install @bluehive/random</code>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default RandomExampleApp;
