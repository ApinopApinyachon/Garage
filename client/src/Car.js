import React from 'react';

const CarDetailsPage = ({ car }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Car Details</h2>
        <div className="mt-6 space-y-4">
          <p className="text-lg font-semibold">Model: <span className="text-gray-600">{car.model}</span></p>
          <p className="text-lg font-semibold">Brand: <span className="text-gray-600">{car.brand}</span></p>
          <p className="text-lg font-semibold">Year: <span className="text-gray-600">{car.year}</span></p>
          <p className="text-lg font-semibold">Color: <span className="text-gray-600">{car.color}</span></p>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
