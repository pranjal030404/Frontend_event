import React, { useState } from 'react';
import { useLocationStore } from '../store/store';
import './LocationSetupModal.css';

const LocationSetupModal = ({ isOpen, onClose }) => {
  const [customLocation, setCustomLocation] = useState('');
  const [customLat, setCustomLat] = useState('28.4089');
  const [customLon, setCustomLon] = useState('77.3178');
  const [useCustom, setUseCustom] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const [loading, setLoading] = useState(false);
  const setDefaultLocation = useLocationStore((state) => state.setDefaultLocation);

  const quickLocations = [
    { name: 'Noida Sector 62', latitude: 28.4089, longitude: 77.3178 },
    { name: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
    { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
    { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946 }
  ];

  const handleQuickLocation = (location) => {
    setDefaultLocation(location);
    onClose();
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(true);
      return;
    }

    setLoading(true);
    setGeoError(false);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setGeoError(true);
      console.log('Geolocation timeout - permission may be blocked');
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const location = {
          name: 'Current Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log('Got current location:', location);
        setDefaultLocation(location);
        setLoading(false);
        onClose();
      },
      (error) => {
        clearTimeout(timeoutId);
        console.log('Geolocation error:', error.code, error.message);
        setLoading(false);
        setGeoError(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customLocation.trim()) {
      alert('Please enter a location name');
      return;
    }
    if (!customLat || !customLon) {
      alert('Please enter valid latitude and longitude');
      return;
    }

    const location = {
      name: customLocation.trim(),
      latitude: parseFloat(customLat),
      longitude: parseFloat(customLon)
    };

    setDefaultLocation(location);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <div className="location-modal-header">
          <h2>📍 Set Your Default Location</h2>
          <p>Where would you like to find events?</p>
        </div>

        <div className="location-modal-content">
          {!useCustom ? (
            <>
              <button
                className="location-btn current-location"
                onClick={handleCurrentLocation}
                type="button"
                title="Uses your device's GPS location"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Detecting Location...
                  </>
                ) : (
                  <>📍 Use My Current Location</>
                )}
              </button>

              {geoError && (
                <div className="geo-error-box">
                  <div className="geo-error-title">⚠️ Location access blocked</div>
                  <p className="geo-error-text">
                    Your browser has blocked location access. To enable it:
                  </p>
                  <ol className="geo-instructions">
                    <li>Click the 🔒 lock icon next to the URL</li>
                    <li>Find "Location" or "Permissions"</li>
                    <li>Change to "Allow"</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                  <button
                    className="location-btn retry-btn"
                    onClick={handleCurrentLocation}
                    type="button"
                  >
                    🔄 Try Again
                  </button>
                </div>
              )}

              <div className="divider">Or choose a quick location</div>

              <div className="quick-locations">
                {quickLocations.map((location) => (
                  <button
                    key={location.name}
                    className="location-btn quick-loc"
                    onClick={() => handleQuickLocation(location)}
                    type="button"
                    disabled={loading}
                  >
                    {location.name}
                  </button>
                ))}
              </div>

              <button
                className="location-btn custom-toggle"
                onClick={() => {
                  setUseCustom(true);
                  setGeoError(false);
                }}
                type="button"
                disabled={loading}
              >
                + Enter Custom Location
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleCustomSubmit} className="custom-location-form">
                <div className="form-group">
                  <label>Location Name</label>
                  <input
                    type="text"
                    placeholder="e.g., My Favorite Cafe"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="input-field"
                    autoFocus
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="28.4089"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="77.3178"
                      value={customLon}
                      onChange={(e) => setCustomLon(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    className="location-btn cancel"
                    onClick={() => {
                      setUseCustom(false);
                      setCustomLocation('');
                      setCustomLat('28.4089');
                      setCustomLon('77.3178');
                    }}
                  >
                    Back
                  </button>
                  <button type="submit" className="location-btn submit">
                    Set Location
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSetupModal;
