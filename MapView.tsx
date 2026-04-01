import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockFriends, mockPublicPlaces, type MockUser, categoryColors, categoryIcons } from "@/lib/mock-data";

export type MapLayerType = "roadmap" | "satellite" | "terrain" | "hybrid";

export interface MeasurePoint {
  latlng: [number, number];
  totalDist: number;
}

interface MapViewProps {
  flyTo: [number, number] | null;
  layerType?: MapLayerType;
  streetViewActive?: boolean;
  onStreetViewClick?: (lat: number, lng: number) => void;
  measureActive?: boolean;
  onMeasureUpdate?: (points: MeasurePoint[], totalDistance: number) => void;
}

const USER_LOCATION: [number, number] = [19.1176, 72.8562];

const TILE_LAYERS: Record<MapLayerType, { url: string; subdomains: string[]; maxZoom: number }> = {
  roadmap: {
    url: "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 20,
  },
  satellite: {
    url: "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 20,
  },
  terrain: {
    url: "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 20,
  },
  hybrid: {
    url: "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 20,
  },
};

const MapView = ({ flyTo, layerType = "roadmap", streetViewActive, onStreetViewClick, measureActive, onMeasureUpdate }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const measureLayerRef = useRef<L.LayerGroup | null>(null);
  const measurePointsRef = useRef<MeasurePoint[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: USER_LOCATION,
      zoom: 14,
      zoomControl: false,
    });

    const cfg = TILE_LAYERS.roadmap;
    const tile = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains,
      attribution: '&copy; Google Maps',
      maxZoom: cfg.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tile;

    L.control.zoom({ position: "topright" }).addTo(map);

    const allMarkers = [...mockFriends, ...mockPublicPlaces];

    allMarkers.forEach((user) => {
      const color = user.type === "friend"
        ? categoryColors.friend
        : categoryColors[user.category || ""] || "hsl(190, 90%, 50%)";
      const emoji = user.type === "friend" ? "" : (categoryIcons[user.category || ""] || "📍");
      const isLive = user.type === "friend" && user.online;

      let iconHtml: string;
      if (user.type === "friend" && user.avatar) {
        iconHtml = `
          <div style="position:relative;width:44px;height:44px;">
            ${isLive ? `<div class="live-pulse-ring"></div>` : ""}
            <div style="width:44px;height:44px;border-radius:50%;border:3px solid ${color};overflow:hidden;background:#fff;">
              <img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            ${isLive ? `<div style="position:absolute;bottom:1px;right:1px;width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #fff;"></div>` : ""}
          </div>`;
      } else {
        iconHtml = `
          <div style="width:36px;height:36px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2px solid #fff;">
            ${emoji}
          </div>`;
      }

      const icon = L.divIcon({
        className: "custom-marker",
        html: iconHtml,
        iconSize: user.type === "friend" ? [44, 44] : [36, 36],
        iconAnchor: user.type === "friend" ? [22, 22] : [18, 18],
      });

      const marker = L.marker([user.lat, user.lng], { icon }).addTo(map);

      const popupContent = `
        <div style="text-align:center;padding:4px;min-width:140px;">
          ${user.avatar ? `<img src="${user.avatar}" style="width:40px;height:40px;border-radius:50%;margin:0 auto 8px;" />` : ""}
          <p style="font-weight:600;font-size:14px;margin:0;">${user.name}</p>
          <p style="font-size:12px;opacity:0.7;margin:2px 0;">@${user.trackId}</p>
          ${user.type === "public" ? `<span style="display:inline-block;margin-top:4px;font-size:10px;padding:2px 8px;border-radius:99px;background:rgba(0,200,200,0.2);color:#0cc;">${user.category}</span>` : ""}
          ${isLive ? `<span style="display:inline-block;margin-top:4px;font-size:10px;padding:2px 8px;border-radius:99px;background:rgba(34,197,94,0.2);color:#22c55e;">● Live</span>` : ""}
        </div>`;

      marker.bindPopup(popupContent);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Switch tile layer when layerType changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const cfg = TILE_LAYERS[layerType];

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const tile = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains,
      attribution: '&copy; Google Maps',
      maxZoom: cfg.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tile;
  }, [layerType]);

  // Street view click handler
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (streetViewActive) {
      map.getContainer().style.cursor = "crosshair";
      const handler = (e: L.LeafletMouseEvent) => {
        onStreetViewClick?.(e.latlng.lat, e.latlng.lng);
      };
      map.on("click", handler);
      return () => {
        map.off("click", handler);
        map.getContainer().style.cursor = "";
      };
    } else {
      map.getContainer().style.cursor = "";
    }
  }, [streetViewActive, onStreetViewClick]);

  // Measure tool
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (!measureLayerRef.current) {
      measureLayerRef.current = L.layerGroup().addTo(map);
    }

    if (measureActive) {
      map.getContainer().style.cursor = "crosshair";

      const handler = (e: L.LeafletMouseEvent) => {
        const pts = measurePointsRef.current;
        const prev = pts.length > 0 ? pts[pts.length - 1].latlng : null;
        const newLatLng: [number, number] = [e.latlng.lat, e.latlng.lng];
        const segDist = prev ? haversineDistance(prev, newLatLng) : 0;
        const totalDist = (pts.length > 0 ? pts[pts.length - 1].totalDist : 0) + segDist;

        const newPoint: MeasurePoint = { latlng: newLatLng, totalDist };
        pts.push(newPoint);
        measurePointsRef.current = [...pts];

        const layer = measureLayerRef.current!;

        // Draw dot
        const dot = L.circleMarker(e.latlng, {
          radius: 6,
          color: "#4285F4",
          fillColor: "#fff",
          fillOpacity: 1,
          weight: 2,
        });
        dot.addTo(layer);

        // Distance label
        if (pts.length > 1) {
          const label = formatDistance(totalDist);
          const divIcon = L.divIcon({
            className: "measure-label",
            html: `<div class="measure-label-inner">${label}</div>`,
            iconSize: [80, 24],
            iconAnchor: [40, -8],
          });
          L.marker(e.latlng, { icon: divIcon, interactive: false }).addTo(layer);
        }

        // Line segment
        if (prev) {
          L.polyline([prev, newLatLng], {
            color: "#4285F4",
            weight: 3,
            opacity: 0.8,
            dashArray: "8 6",
          }).addTo(layer);
        }

        onMeasureUpdate?.(measurePointsRef.current, totalDist);
      };

      map.on("click", handler);
      return () => {
        map.off("click", handler);
        map.getContainer().style.cursor = "";
      };
    } else {
      // Clear measure data when deactivated
      if (measureLayerRef.current) {
        measureLayerRef.current.clearLayers();
      }
      measurePointsRef.current = [];
      map.getContainer().style.cursor = "";
    }
  }, [measureActive, onMeasureUpdate]);

  // Fly to selected location + draw route line
  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    const map = mapRef.current;

    map.flyTo(flyTo, 16, { duration: 1.5 });

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    const points = generateCurvePoints(USER_LOCATION, flyTo, 30);
    const polyline = L.polyline(points, {
      color: "#4285F4",
      weight: 4,
      opacity: 0.9,
      className: "route-line",
    }).addTo(map);

    routeLineRef.current = polyline;
  }, [flyTo]);

  return <div ref={containerRef} className="absolute inset-0" />;
};

function generateCurvePoints(
  start: [number, number],
  end: [number, number],
  numPoints: number
): [number, number][] {
  const points: [number, number][] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  const dx = end[1] - start[1];
  const dy = end[0] - start[0];
  const offsetLat = midLat + dy * 0.15;
  const offsetLng = midLng - dx * 0.15;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * offsetLat + t * t * end[0];
    const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * offsetLng + t * t * end[1];
    points.push([lat, lng]);
  }
  return points;
}

function haversineDistance(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

export default MapView;
