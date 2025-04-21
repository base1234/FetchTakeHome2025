// sn_DogCard.jsx - Displays individual dog info

import React from 'react';

function Sn_DogCard({ dog, onFavorite, isFavorite }) {
  return (
    <div className={`dog-card ${isFavorite ? 'favorite-dog' : ''}`}>
      <img
        src={dog.img}
        alt={dog.name}
        className="dog-image"
      />
      <h3 className="dog-name">{dog.name}</h3>
      <p><strong>Breed:</strong> {dog.breed}</p>
      <p><strong>Age:</strong> {dog.age} years</p>

      {/* Show location if available */}
      {dog.location ? (
        <p><strong>📍 {dog.location.city}, {dog.location.state} ({dog.zip_code})</strong></p>
      ) : (
        <p><strong>ZIP:</strong> {dog.zip_code}</p>
      )}

      <button
        className="favorite-button"
        onClick={() => onFavorite(dog.id)}
      >
        {isFavorite ? '★ Unfavorite' : '☆ Favorite'}
      </button>
    </div>
  );
}

export default Sn_DogCard;

