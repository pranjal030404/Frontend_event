import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useLocationStore } from '../store/store';
import './MapComponent.css';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ plans, onMarkerClick }) => {
  const defaultLocation = useLocationStore((state) => state.defaultLocation);
  const [center, setCenter] = useState([defaultLocation.latitude, defaultLocation.longitude]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Update center when default location changes
    setCenter([defaultLocation.latitude, defaultLocation.longitude]);
  }, [defaultLocation]);

  useEffect(() => {
    // Try to get user's location, but don't block if it fails
    const timeoutId = setTimeout(() => {
      setMapLoaded(true);
    }, 3000); // Timeout after 3 seconds

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setMapLoaded(true);
          clearTimeout(timeoutId);
        },
        () => {
          // Silently fail and use default location
          setMapLoaded(true);
          clearTimeout(timeoutId);
        },
        { timeout: 3000 }
      );
    } else {
      setMapLoaded(true);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  const formatDateTime = (dateTime) => {
    try {
      if (typeof dateTime === 'string') {
        return new Date(dateTime).toLocaleString();
      } else if (dateTime instanceof Date) {
        return dateTime.toLocaleString();
      }
      return 'TBD';
    } catch (e) {
      return 'TBD';
    }
  };

  return (
    <div className="map-container">
      {mapLoaded && (
        <MapContainer center={center} zoom={13} className="map">
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {plans && plans.length > 0 && plans.map((plan) => (
            plan.location && plan.location.latitude && plan.location.longitude && (
              <Marker
                key={plan._id}
                position={[plan.location.latitude, plan.location.longitude]}
                onClick={() => onMarkerClick(plan)}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>{plan.title}</h3>
                    <p><strong>Location:</strong> {plan.location.name}</p>
                    <p><strong>When:</strong> {formatDateTime(plan.dateTime)}</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapComponent;
