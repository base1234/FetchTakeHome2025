// sn_MatchPage.jsx - Display the matched dog
import React from 'react';

function Sn_MatchPage({ dog, onBack }) {
  return (
    <div className="match-page">
      <h2 className="rainbow-text" style={{ marginBottom: '20px' }}>🎉 Your Pawfect Match! 🎉</h2>

      <div className="match-card">
        <img
          src={dog.img}
          alt={dog.name}
          className="match-image"
        />

        <h3 className="dog-name">{dog.name}</h3>

        <div className="match-info">
          <p><strong>Breed:</strong> {dog.breed}</p>
          <p><strong>Age:</strong> {dog.age} years</p>

          {/* Show City, State and ZIP if available */}
          {dog.location ? (
            <p><strong>📍 Location:</strong> {dog.location.city}, {dog.location.state} ({dog.zip_code})</p>
          ) : (
            <p><strong>ZIP Code:</strong> {dog.zip_code}</p>
          )}
        </div>
      </div>

      <button className="back-button" onClick={onBack}>
        Back to Search
      </button>
    </div>
  );
}

export default Sn_MatchPage;


