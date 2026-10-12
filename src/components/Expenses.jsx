import React from 'react';

export default function Expenses() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
      <p className="text-sm text-gray-500 mb-4">Track ADDC, WiFi, Gas Cylinders, and Maintenance.</p>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between p-3 bg-gray-50 rounded border">
          <span className="font-medium text-gray-700">ADDC (Electricity & Water)</span>
          <span className="font-bold text-gray-900">AED 1,882</span>
        </li>
        <li className="flex justify-between p-3 bg-gray-50 rounded border">
          <span className="font-medium text-gray-700">WiFi / Internet</span>
          <span className="font-bold text-gray-900">AED 430</span>
        </li>
        <li className="flex justify-between p-3 bg-gray-50 rounded border">
          <span className="font-medium text-gray-700">Natur & Maintenance</span>
          <span className="font-bold text-gray-900">AED 340</span>
        </li>
      </ul>
    </div>
  );
}
