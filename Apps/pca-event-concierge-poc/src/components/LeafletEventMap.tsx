import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { type ConciergeEvent, USER_LOCATION } from "../data/events";

export function LeafletEventMap({ event }: { event: ConciergeEvent }) {
  return (
    <div className="map-shell" aria-label={`Map preview for ${event.title}`}>
      <MapContainer center={event.coords} zoom={13} scrollWheelZoom={false} className="map-container">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={USER_LOCATION} />
        <Marker position={event.coords} />
        <Polyline positions={[USER_LOCATION, event.coords]} pathOptions={{ color: "#7c3aed", weight: 4 }} />
      </MapContainer>
    </div>
  );
}
