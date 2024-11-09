// src/pages/Homepage.js
import React from 'react';
import { Link } from '@tanstack/react-router';

function Homepage() {
  return (
    <div>
      <h1>Welcome to the Queue System</h1>
      <p>This is the homepage of the queue system.</p>
      <Link to="/order">Go to Order Page</Link>
    </div>
  );
}

export default Homepage;
