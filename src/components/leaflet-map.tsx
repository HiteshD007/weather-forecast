import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import { useEffect, useRef } from 'react';

interface mapProps{
  localCoordinate : {lat:number, lon:number}
  handleLocalCoordinateChange : (lat:number, lon:number) => void
}

const LeafletMap = ({
  localCoordinate,
  handleLocalCoordinateChange
}:mapProps) => {

  const mapRef = useRef<L.Map | null>(null); 

  const initMap = (lat:number,lon:number) => {
    if(mapRef.current) return;

    const map = L.map('map').setView([lat, lon], 14); 
    mapRef.current = map;

     // Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add draggable marker
    const marker = L.marker([lat,lon], { draggable: true }).addTo(map);

    marker.on('dragend', function () {
      const pos = marker.getLatLng();
      handleLocalCoordinateChange(pos.lat, pos.lng);
    });
    
    map.addEventListener('click',(e) => {
      const pos = e.latlng;
      marker.setLatLng([pos.lat, pos.lng]);
      handleLocalCoordinateChange(pos.lat, pos.lng);
    });

    // Search box (autocomplete + move marker)
    L.Control.geocoder({
      defaultMarkGeocode: false
    })
      .on('markgeocode', (e:any) => {
        const { lat,lng } = e.geocode.center;
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 13);
        handleLocalCoordinateChange(lat, lng);
      })
      .addTo(map);
    L.popup().setLatLng([lat,lon]).setContent('<p>Drag marker or click to set location</p>').openOn(map);
  }


  useEffect(() => {
    initMap(localCoordinate.lat, localCoordinate.lon);
  },[]);


  return (
    <div id='map' className='w-full h-full !z-0'/>
  )
};

export default LeafletMap;
