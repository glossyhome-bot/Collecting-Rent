import React from 'react';
import Dashboard from './components/Dashboard';
import RoomInventory from './components/RoomInventory';
import Expenses from './components/Expenses';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Glossy Home Property Manager</h1>
      </header>
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <Dashboard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoomInventory />
          <Expenses />
        </div>
      </main>
    </div>
  );
}

export default App;
