import React from 'react';

export function Header() {
  return (
    <header className="bg-white border-b p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-xl font-bold">Vocare</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Welcome, {process.env.NEXT_PUBLIC_USER_LOGIN || 'User'}</span>
        </div>
      </div>
    </header>
  );
}