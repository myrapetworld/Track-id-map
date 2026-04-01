import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import MapView, { type MapLayerType, type MeasurePoint } from "@/components/MapView";
import SearchBar from "@/components/SearchBar";
import QuickPanel from "@/components/QuickPanel";
import UserDetailCard from "@/components/UserDetailCard";
import { type MockUser } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Locate, Plus, Layers, Map, Satellite, Mountain, X, PersonStanding, Ruler, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const USER_LOCATION: [number, number] = [19.1176, 72.8562];

function haversineDistance(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

const layerOptions: { type: MapLayerType; label: string; icon: React.ReactNode }[] = [
  { type: "roadmap", label: "Map", icon: <Map className="w-4 h-4" /> },
  { type: "satellite", label: "Satellite", icon: <Satellite className="w-4 h-4" /> },
  { type: "terrain", label: "Terrain", icon: <Mountain className="w-4 h-4" /> },
  { type: "hybrid", label: "Hybrid", icon: <Layers className="w-4 h-4" /> },
];

const MapPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [layerType, setLayerType] = useState<MapLayerType>("roadmap");
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [streetViewActive, setStreetViewActive] = useState(false);
  const [streetViewCoords, setStreetViewCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [measureActive, setMeasureActive] = useState(false);
  const [measureDistance, setMeasureDistance] = useState(0);
  const [measurePoints, setMeasurePoints] = useState<MeasurePoint[]>([]);

  // User detail card state from URL params
  const [selectedUser, setSelectedUser] = useState<{
    username: string; trackId: string; avatar: string;
    lat: number; lng: number; battery: number;
    locationType: "current" | "home" | "office";
  } | null>(null);

  // Read URL params on mount
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const name = searchParams.get("name");
    const trackId = searchParams.get("trackId");
    const avatar = searchParams.get("avatar");

    if (lat && lng) {
      const latN = parseFloat(lat);
      const lngN = parseFloat(lng);
      setFlyTo([latN, lngN]);

      if (name && trackId) {
        const locTypes: Array<"current" | "home" | "office"> = ["current", "home", "office"];
        setSelectedUser({
          username: name,
          trackId: trackId || name.toLowerCase().replace(/\s+/g, ""),
          avatar: avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${trackId || name}`,
          lat: latN,
          lng: lngN,
          battery: Math.floor(Math.random() * 60) + 30,
          locationType: (searchParams.get("locType") as "current" | "home" | "office") || locTypes[Math.floor(Math.random() * 3)],
        });
      }

      // Clear params after reading
      setSearchParams({}, { replace: true });
    }
  }, []);

  const handleLocate = (user: MockUser) => {
    setFlyTo([user.lat, user.lng]);
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setFlyTo([pos.coords.latitude, pos.coords.longitude]),
        () => setFlyTo([19.1176, 72.8562])
      );
    }
  };

  const handleStreetViewClick = useCallback((lat: number, lng: number) => {
    setStreetViewCoords({ lat, lng });
    setStreetViewActive(false);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 relative overflow-hidden h-screen">
        <SearchBar onSelect={handleLocate} />

        {/* User Detail Card */}
        <AnimatePresence>
          {selectedUser && (
            <UserDetailCard
              username={selectedUser.username}
              trackId={selectedUser.trackId}
              avatar={selectedUser.avatar}
              distance={haversineDistance(USER_LOCATION, [selectedUser.lat, selectedUser.lng])}
              battery={selectedUser.battery}
              locationType={selectedUser.locationType}
              lastUpdated="Just now"
              onClose={() => setSelectedUser(null)}
            />
          )}
        </AnimatePresence>

        {/* Map Controls */}
        <div className="absolute right-4 top-20 z-10 flex flex-col gap-2">
          <Button variant="outline" size="icon" onClick={handleMyLocation} className="glass-card w-10 h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30 shadow-md">
            <Locate className="w-4 h-4" />
          </Button>

          <div className="relative">
            <Button variant="outline" size="icon" onClick={() => setShowLayerPicker(!showLayerPicker)} className="glass-card w-10 h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30 shadow-md">
              <Layers className="w-4 h-4" />
            </Button>
            <AnimatePresence>
              {showLayerPicker && (
                <motion.div initial={{ opacity: 0, scale: 0.9, x: 10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, x: 10 }} transition={{ duration: 0.2 }}
                  className="absolute right-12 top-0 glass-card-elevated p-2 flex flex-col gap-1 min-w-[140px]">
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Map Type</p>
                  {layerOptions.map((opt) => (
                    <button key={opt.type} onClick={() => { setLayerType(opt.type); setShowLayerPicker(false); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${layerType === opt.type ? "bg-primary/15 text-primary font-medium" : "hover:bg-muted/50 text-foreground"}`}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button variant="outline" size="icon" onClick={() => { setStreetViewActive(!streetViewActive); setStreetViewCoords(null); }}
            className={`glass-card w-10 h-10 shadow-md transition-all ${streetViewActive ? "bg-primary/20 text-primary border-primary/40 ring-2 ring-primary/30" : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"}`}>
            <PersonStanding className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => { setMeasureActive(!measureActive); if (measureActive) { setMeasureDistance(0); setMeasurePoints([]); } }}
            className={`glass-card w-10 h-10 shadow-md transition-all ${measureActive ? "bg-primary/20 text-primary border-primary/40 ring-2 ring-primary/30" : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"}`}>
            <Ruler className="w-4 h-4" />
          </Button>

          <Button size="icon" className="w-10 h-10 gradient-primary text-primary-foreground glow-primary shadow-md">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Measure Banner */}
        <AnimatePresence>
          {measureActive && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-20 glass-card-elevated px-4 py-2.5 flex items-center gap-3">
              <Ruler className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {measurePoints.length === 0 ? "Click on the map to start measuring" : `Distance: ${measureDistance < 1000 ? `${Math.round(measureDistance)} m` : `${(measureDistance / 1000).toFixed(2)} km`}`}
                </span>
                {measurePoints.length > 0 && <span className="text-xs text-muted-foreground">{measurePoints.length} point{measurePoints.length > 1 ? "s" : ""} · Click to add more</span>}
              </div>
              {measurePoints.length > 0 && (
                <button onClick={() => { setMeasureActive(false); setMeasureDistance(0); setMeasurePoints([]); }} className="ml-1 p-1 rounded-md hover:bg-destructive/10 text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={() => { setMeasureActive(false); setMeasureDistance(0); setMeasurePoints([]); }} className="ml-1 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Street View Banner */}
        <AnimatePresence>
          {streetViewActive && !streetViewCoords && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-20 glass-card-elevated px-4 py-2 flex items-center gap-2">
              <PersonStanding className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Click anywhere on the map to open Street View</span>
              <button onClick={() => setStreetViewActive(false)} className="ml-2 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Street View Embed */}
        <AnimatePresence>
          {streetViewCoords && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-[480px] h-[320px] z-20 rounded-2xl overflow-hidden border border-border shadow-xl">
              <div className="relative w-full h-full">
                <button onClick={() => setStreetViewCoords(null)} className="absolute top-3 right-3 z-30 bg-background/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-background shadow-md">
                  <X className="w-4 h-4" />
                </button>
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1s!2m2!1d${streetViewCoords.lat}!2d${streetViewCoords.lng}!3f0!4f0!5f0.7820865974627469&output=svembed`}
                  className="w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Street View"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-3">
                  <p className="text-xs text-muted-foreground font-medium">📍 {streetViewCoords.lat.toFixed(4)}, {streetViewCoords.lng.toFixed(4)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MapView flyTo={flyTo} layerType={layerType} streetViewActive={streetViewActive && !measureActive} onStreetViewClick={handleStreetViewClick}
          measureActive={measureActive} onMeasureUpdate={(pts, dist) => { setMeasurePoints(pts); setMeasureDistance(dist); }} />
        <QuickPanel onLocate={handleLocate} />
      </div>
    </div>
  );
};

export default MapPage;
