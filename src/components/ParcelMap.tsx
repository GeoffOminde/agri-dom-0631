
import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface Coordinates {
  lat: number;
  lng: number;
}

interface ParcelMapProps {
  coordinates: Coordinates;
  parcelName: string;
  isEditing: boolean;
  onCoordinatesChange?: (coordinates: Coordinates) => void;
}

// Custom marker icon (avoids asset path issues)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Click handler component to update coordinates when editing
const ClickToMove: React.FC<{ isEditing: boolean; onMove?: (coords: Coordinates) => void; }> = ({ isEditing, onMove }) => {
  useMapEvents({
    click(e) {
      if (!isEditing || !onMove) return;
      const { lat, lng } = e.latlng;
      onMove({ lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) });
    }
  });
  return null;
};

const ParcelMap = ({ coordinates, parcelName, isEditing, onCoordinatesChange }: ParcelMapProps) => {
  const center: [number, number] = [
    isFinite(coordinates.lat) ? coordinates.lat : 0,
    isFinite(coordinates.lng) ? coordinates.lng : 0
  ];

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={markerIcon}>
          <Popup>{parcelName}</Popup>
        </Marker>
        <ClickToMove
          isEditing={isEditing}
          onMove={onCoordinatesChange}
        />
      </MapContainer>
      {/* Coordinates display */}
      <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs rounded shadow">
        Lat: {coordinates.lat} | Lng: {coordinates.lng}
      </div>
      {isEditing && (
        <div className="absolute bottom-2 left-0 right-0 text-center bg-white/80 py-1 text-xs">
          Click on the map to move the marker
        </div>
      )}
    </div>
  );
};

export default ParcelMap;
