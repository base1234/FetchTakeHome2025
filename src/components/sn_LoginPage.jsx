// sn_LoginPage.jsx - Login form component

import React, { useState } from 'react';
import { Sn_login } from '../api/sn_api';

function Sn_LoginPage({ onLoginSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function Sn_handleLogin(e) {
    e.preventDefault();
    console.log('Submitting login with:', name, email);

    try {
      setLoading(true);  // Start loading
      await Sn_login(name, email);
      console.log('Login successful - calling onLoginSuccess');
      onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <div className="login-page">
      <h2 className="login-title rainbow-text">🐶 Welcome!!!! 🐶</h2>

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <form onSubmit={Sn_handleLogin} className="login-form">
          <input
            className="input-field"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="button" type="submit">Login</button>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Sn_LoginPage;

