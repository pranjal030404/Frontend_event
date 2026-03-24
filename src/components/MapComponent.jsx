import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './MapComponent.css';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ plans, onMarkerClick }) => {
  const [center, setCenter] = useState([51.505, -0.09]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasLoggedFallback, setHasLoggedFallback] = useState(false);

  useEffect(() => {
    // Try to get user's location, but don't block if it fails
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setMapLoaded(true);
        },
        (error) => {
          if (!hasLoggedFallback) {
            if (error?.code === error.PERMISSION_DENIED) {
              console.log('Location permission denied/blocked. Using default map coordinates.');
            } else {
              console.log('Could not get user location. Using default map coordinates.');
            }
            setHasLoggedFallback(true);
          }
          setMapLoaded(true);
        },
        { timeout: 5000 } // 5 second timeout
      );
    } else {
      setMapLoaded(true);
    }
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
