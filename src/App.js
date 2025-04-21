import React, { useState } from 'react';
import Sn_LoginPage from './components/sn_LoginPage';
import Sn_SearchPage from './components/sn_SearchPage';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  console.log('loggedIn state:', loggedIn);

  function handleLogout() {
    console.log('Logging out...');
    setLoggedIn(false);  // Go back to Login page
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/colorful-dog-paw-print-by-sharon-cummings-sharon-cummings.jpg', // 🐾 Cute paw background
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 200px',
      backgroundColor: '#fff8e7',
      padding: '20px',
    }}>
      {/* Title */}
	  <header className="header">
      <h1 className="main-title rainbow-text">🐾 ஸ்ரிகாந்தின் 犬 Matcher 🐾</h1>
      <p className="subtitle rainbow-text">🐾 Connecting paws with hearts! 🐾</p>

      {loggedIn && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      <main>
        {loggedIn ? (
          <Sn_SearchPage />
        ) : (
          <Sn_LoginPage onLoginSuccess={() => setLoggedIn(true)} />
        )}
      </main>
    </div>
  );
}

export default App;