// Header.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">My App</h1>
      <nav>
        <Link to="/" className="mx-2 text-white hover:text-gray-200">
          Home
        </Link>
        <Link to="/order" className="mx-2 text-white hover:text-gray-200">
          Order
        </Link>
      </nav>
    </header>
  );
};

export default Header;
