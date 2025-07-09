import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { format } from 'date-fns';
import { Mission } from '../types/mission';

// Correction pour l'icône du marqueur Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface DashboardMapProps {
  missions: (Mission & { coordinates: [number, number] })[];
}

const DashboardMap: React.FC<DashboardMapProps> = ({ missions }) => {
  return (
    <MapContainer 
      center={[14.6937, -17.4441]} 
      zoom={11} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {missions.map((mission) => (
        <Marker 
          key={mission.id} 
          position={mission.coordinates}
        >
          <Popup>
            <div>
              <h4 className="font-semibold">{mission.title}</h4>
              <p className="text-sm">{mission.organization}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(mission.start_date), 'dd/MM/yyyy')}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DashboardMap; 