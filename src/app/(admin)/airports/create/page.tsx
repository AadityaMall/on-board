"use client";
import React, { useState } from "react";
import { Country, City } from "country-state-city";

const AirportForm = () => {
  const [countryCode, setCountryCode] = useState("IN"); // Default country
  const [city, setCity] = useState("");
  const [airportName, setAirportName] = useState("");
  const cities = City.getCitiesOfCountry(countryCode);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Airport Selection</h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Country Code Selection */}
        <div>
          <label className="block text-sm font-medium">Select Country</label>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value={"IN"}>India</option>
          </select>
        </div>

        {/* City Selection */}
        <div>
          <label className="block text-sm font-medium">Select City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Choose a city</option>
            {cities?.map((c) => (
              <option
                key={`${c.name}-${c.stateCode}-${c.countryCode}`}
                value={c.name}
              >
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Airport Name Input */}
        <div>
          <label className="block text-sm font-medium">Airport Name</label>
          <input
            type="text"
            value={airportName}
            onChange={(e) => setAirportName(e.target.value)}
            placeholder="Enter airport name"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AirportForm;
