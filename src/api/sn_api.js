// sn_api.js - API helper functions

// sn_api.js - API helper functions
const BASE_URL = "https://frontend-take-home-service.fetch.com";

// Helper to make requests with credentials
export async function Sn_fetch(url, options = {}, expectJson = true) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  if (!expectJson) {
    return {}; // No JSON expected
  }

  const text = await res.text();
  if (!text) {
    return {}; // Empty body
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('JSON parsing error. Raw response was:', text);
    throw new Error('Failed to parse server response.');
  }
}

// API endpoints
export function Sn_login(name, email) {
  return Sn_fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  }, false); // No JSON expected
}

export function Sn_logout() {
  return Sn_fetch('/auth/logout', { method: 'POST' }, false);
}

export function Sn_getBreeds() {
  return Sn_fetch('/dogs/breeds');
}

export function Sn_searchDogs({ breeds = [], zipCodes = [], size = 10, from = 0, sort = 'breed:asc' }) {
  const params = new URLSearchParams();
  if (breeds.length) breeds.forEach(breed => params.append('breeds', breed));
  if (zipCodes.length) zipCodes.forEach(zip => params.append('zipCodes', zip));
  params.append('sort', sort);
  params.append('size', size);
  params.append('from', from);
  return Sn_fetch(`/dogs/search?${params.toString()}`);
}

export function Sn_getDogsByIds(ids) {
  return Sn_fetch('/dogs', {
    method: 'POST',
    body: JSON.stringify(ids),
  });
}

export function Sn_matchDogs(ids) {
  return Sn_fetch('/dogs/match', {
    method: 'POST',
    body: JSON.stringify(ids),
  });
}

// Fetch locations given array of zip codes
export function Sn_getLocations(zipCodes) {
  return Sn_fetch('/locations', {
    method: 'POST',
    body: JSON.stringify(zipCodes),
  });
}


export function Sn_searchLocations({ city, states }) {
  return Sn_fetch('/locations/search', {
    method: 'POST',
    body: JSON.stringify({ city, states }),
  });
}
