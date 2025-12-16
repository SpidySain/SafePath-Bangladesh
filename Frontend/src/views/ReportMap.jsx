import { useMemo } from "react";
import { GoogleMap, Circle, MarkerF, InfoWindowF, useJsApiLoader } from "@react-google-maps/api";
import { severityColor, severityRadiusMeters } from "../utils/map";
import "./map.css";

const defaultCenter = { lat: 23.8103, lng: 90.4125 }; // Dhaka

export default function ReportMap({ reports }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const points = useMemo(() => {
    return (reports || [])
      .filter(r => r.location?.latitude && r.location?.longitude)
      .map(r => {
        const lat = Number(r.location.latitude);
        const lng = Number(r.location.longitude);
        return {
          id: r._id || r.id || `${lat}-${lng}-${r.createdAt}`,
          lat,
          lng,
          severity: r.severity ?? 3,
          status: r.status ?? "PENDING",
          label: r.issueCategory?.name || "Issue",
          description: r.description || "",
          locationLabel: r.location?.upazila
            ? `${r.location.upazila}, ${r.location.district || r.location.city || ""}`
            : r.location?.district || r.location?.city || "",
          createdAt: r.createdAt
        };
      });
  }, [reports]);

  const center = points.length
    ? { lat: points[0].lat, lng: points[0].lng }
    : defaultCenter;

  if (loadError) {
    return <div className="muted">Map failed to load: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div className="muted">Loading Google Map...</div>;
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerClassName="map-canvas"
        center={center}
        zoom={12}
        options={{
          styles: mapStyle,
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false
        }}
      >
        {points.map(point => {
          const color = severityColor(point.severity, point.status);
          const radius = severityRadiusMeters(point.severity);
          return (
            <Circle
              key={`c-${point.id}`}
              center={{ lat: point.lat, lng: point.lng }}
              radius={radius}
              options={{
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.25
              }}
            />
          );
        })}

        {points.map(point => {
          const color = severityColor(point.severity, point.status);
          return (
            <MarkerF
              key={`m-${point.id}`}
              position={{ lat: point.lat, lng: point.lng }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: 2
              }}
            >
              <InfoWindowF>
                <div className="map-info">
                  <strong>{point.label}</strong>
                  <div className="muted">{point.locationLabel}</div>
                  <div>{point.description || "No description."}</div>
                  <div className="muted">
                    Severity: {point.severity} | Status: {point.status}
                  </div>
                  {point.createdAt && (
                    <div className="muted">
                      {new Date(point.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </InfoWindowF>
            </MarkerF>
          );
        })}
      </GoogleMap>
    </div>
  );
}

// Dark-ish map style for contrast
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#102231" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#102231" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ecae6" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1c3a4f" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8ecae6" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#1b4965" }]
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }]
  }
];
