// WeatherCard component
import React from 'react';
import { FaMapMarkerAlt, FaBookOpen} from 'react-icons/fa';


  const Header = ({ weather, userName, handleLogout }) => (
    <div className="weather-card rounded-lg shadow-md p-4 text-white w-full md:w-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaBookOpen className="text-indigo-600 mr-3" />
              Zendy
          </h1>
          <p className="text-gray-600">Your daily study companion</p>
          <br/>
          <p className="text-gray-600">
        {userName ? `Welcome, ${userName}!` : "Your daily study companion"}
        {userName && (
          <button
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </p>
        </div>
      <div className="flex items-center justify-between gap-5">
        <div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            <span id="city" className="font-semibold">{weather.city}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div id="weather-icon" className="text-4xl mr-3">
            {weather.icon}
          </div>
          <div>
            <div id="temperature" className="text-2xl font-bold">{weather.temperature}</div>
            <div id="weather-description" className="text-xs capitalize">{weather.description}</div>
          </div>
        </div>
      </div>
    </div>
  );

export default Header;
