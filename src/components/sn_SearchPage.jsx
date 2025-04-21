// sn_SearchPage.jsx - Search dogs

import React, { useState, useEffect } from 'react';
import { Sn_getBreeds, Sn_searchDogs, Sn_getDogsByIds, Sn_matchDogs, Sn_searchLocations, Sn_getLocations } from '../api/sn_api';
import Sn_DogCard from './sn_DogCard';
import Sn_MatchPage from './sn_MatchPage';

function Sn_SearchPage() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [locationZipCodes, setLocationZipCodes] = useState([]);
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('breed:asc');
  const [matchDog, setMatchDog] = useState(null);

  useEffect(() => {
    async function loadBreeds() {
      const breedList = await Sn_getBreeds();
      setBreeds(breedList);
    }
    loadBreeds();
  }, []);

	useEffect(() => {
	  async function loadDogs() {
		try {
		  const query = {
			size: 10,
			from: page * 10,
			sort: sortOrder,
		  };

		  if (zipCode) {
			query.zipCodes = [zipCode];
		  } else if (locationZipCodes.length > 0) {
			query.zipCodes = locationZipCodes;
		  }

		  if (selectedBreed) {
			query.breeds = [selectedBreed];
		  }

		  // Step 1: Fetch search results
		  const searchResult = await Sn_searchDogs(query);
		  const ids = searchResult.resultIds || [];
		  setDogIds(ids);

		  // Step 2: Fetch dog details
		  const dogDetails = await Sn_getDogsByIds(ids);

		  // Step 3: Collect unique zip codes
		  const zipCodes = [...new Set(dogDetails.map(dog => dog.zip_code))];

		  // Step 4: Fetch location info
		  const locations = await Sn_getLocations(zipCodes);

		  // Step 5: Create a lookup map for zip to location
		  const zipToLocation = {};
		  locations.forEach(loc => {
			zipToLocation[loc.zip_code] = loc;
		  });

		  // Step 6: Attach location to each dog
		  const locDogs = dogDetails.map(dog => ({
			...dog,
			location: zipToLocation[dog.zip_code] || null,
		  }));

		  setDogs(locDogs);
		} catch (err) {
		  console.error('Failed to load dogs:', err);
		}
	  }
	  loadDogs();
	}, [selectedBreed, zipCode, locationZipCodes, page, sortOrder]);


  async function handleLocationSearch() {
    try {
      if (!city.trim() && !stateCode.trim()) {
        alert('Please enter a city or a state to search.');
        return;
      }
      if (stateCode && stateCode.length !== 2) {
        alert('State must be a 2-letter code like TX.');
        return;
      }

      const locationResult = await Sn_searchLocations({
        city: city.trim(),
        states: stateCode ? [stateCode.trim()] : [],
      });

      const zipCodesFound = locationResult.results.map(loc => loc.zip_code);

      if (zipCodesFound.length === 0) {
        alert('No locations found matching your search.');
        return;
      }

      setLocationZipCodes(zipCodesFound);
      setZipCode('');
      setPage(0);
    } catch (err) {
      console.error('Failed to search locations:', err);
      alert('Error searching locations.');
    }
  }

  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  }

  async function generateMatch() {
    const matchResult = await Sn_matchDogs(favorites);
    const matchedDog = await Sn_getDogsByIds([matchResult.match]);
    setMatchDog(matchedDog[0]);
  }

  if (matchDog) {
    return <Sn_MatchPage dog={matchDog} onBack={() => setMatchDog(null)} />;
  }

  return (
    <div>
      <h2 className="main-title rainbow-text" style={{ fontSize: '2rem', marginBottom: '20px' }}>
        🐾 Find Your Perfect Dog! 🐾
      </h2>

      {/* Filters */}
      <div className="filters-container">
        {/* Breed Filter */}
        <select
          className="input-field"
          id="breedSelect"
          value={selectedBreed}
          onChange={(e) => {
            setSelectedBreed(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All Breeds</option>
          {breeds.map(breed => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>

        {/* City Input */}
        <input
          className="input-field"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        {/* State Input */}
        <input
          className="input-field"
          type="text"
          placeholder="State (e.g. TX)"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
          style={{ width: '60px' }}
        />

        {/* Location Search Button */}
        <button className="button" onClick={handleLocationSearch}>
          Search Location
        </button>

        {/* ZIP Code Input */}
        <input
          className="input-field"
          type="text"
          placeholder="ZIP Code"
          value={zipCode}
          onChange={(e) => {
            const zip = e.target.value;
            if (/^\d{0,5}$/.test(zip)) {
              setZipCode(zip);
            }
          }}
        />

        {/* Search by ZIP */}
        <button
          className="button"
          onClick={() => {
            if (zipCode.length !== 5) {
              alert('Please enter a valid 5-digit ZIP Code.');
              return;
            }
            setLocationZipCodes([]);
            setCity('');
            setStateCode('');
            setPage(0);
          }}
        >
          Search by ZIP
        </button>

        {/* Sort Button */}
        <button
          className="button"
          onClick={() => setSortOrder(sortOrder === 'breed:asc' ? 'breed:desc' : 'breed:asc')}
        >
          Toggle Sort ({sortOrder.split(':')[1]})
        </button>
      </div>

      {/* Dogs List */}
      <div className="dog-cards-container">
        {dogs.length ? dogs.map(dog => (
          <Sn_DogCard
            key={dog.id}
            dog={dog}
            onFavorite={toggleFavorite}
            isFavorite={favorites.includes(dog.id)}
          />
        )) : (
          <p>No dogs found. 🐾</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page {page + 1}</span>
        <button className="button" onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {/* Favorites */}
      <div className="favorites-section">
        <h3>Favorites: {favorites.length}</h3>
        <button className="button" onClick={generateMatch} disabled={!favorites.length}>
          Find Your Match!
        </button>
      </div>
    </div>
  );
}

export default Sn_SearchPage;



