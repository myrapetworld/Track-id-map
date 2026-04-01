import { motion } from "framer-motion";
import { X, MapPin, Battery, Home, Briefcase, Navigation, Signal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserDetailCardProps {
  username: string;
  trackId: string;
  avatar: string;
  distance: number; // in meters
  battery: number; // 0-100
  locationType: "current" | "home" | "office";
  lastUpdated?: string;
  onClose: () => void;
}

const getBatteryColor = (level: number) => {
  if (level > 60) return "text-emerald-500";
  if (level > 30) return "text-yellow-500";
  return "text-destructive";
};

const getBatteryBg = (level: number) => {
  if (level > 60) return "bg-emerald-500";
  if (level > 30) return "bg-yellow-500";
  return "bg-destructive";
};

const formatDist = (m: number) => m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;

const locationLabels = {
  current: { label: "Live Location", icon: Navigation, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  home: { label: "Home Location", icon: Home, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  office: { label: "Office Location", icon: Briefcase, className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
};

const UserDetailCard = ({ username, trackId, avatar, distance, battery, locationType, lastUpdated, onClose }: UserDetailCardProps) => {
  const loc = locationLabels[locationType];
  const LocIcon = loc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -30, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="absolute top-20 left-4 z-20 w-72"
    >
      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-4 pb-3">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={avatar} alt={username} className="w-12 h-12 rounded-full border-2 border-primary/30" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">{username}</p>
              <p className="text-xs text-muted-foreground">@{trackId}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          {/* Distance */}
          <div className="bg-secondary/40 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-muted-foreground font-medium">Distance</span>
            </div>
            <p className="text-sm font-bold">{formatDist(distance)}</p>
          </div>

          {/* Battery */}
          <div className="bg-secondary/40 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Battery className={`w-3 h-3 ${getBatteryColor(battery)}`} />
              <span className="text-[10px] text-muted-foreground font-medium">Battery</span>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-bold ${getBatteryColor(battery)}`}>{battery}%</p>
              <div className="flex-1 h-1.5 rounded-full bg-secondary">
                <div className={`h-full rounded-full ${getBatteryBg(battery)} transition-all`} style={{ width: `${battery}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Location Type + Last Updated */}
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${loc.className}`}>
              <LocIcon className="w-3 h-3" />
              {loc.label}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Signal className="w-3 h-3 text-emerald-500" />
              Online
            </div>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              Updated {lastUpdated}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <Button size="sm" className="flex-1 gradient-primary text-primary-foreground text-xs h-8">
            <Navigation className="w-3 h-3 mr-1" /> Navigate
          </Button>
          <Button size="sm" variant="outline" className="text-xs h-8 border-border/50">
            <Signal className="w-3 h-3 mr-1" /> Track
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetailCard;
