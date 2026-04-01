import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Tag, Globe, Lock, Pencil, Trash2, MapPin, Copy, Check,
  Smartphone, Battery, Clock, User, Share2, Map, Eye, Shield,
  Bell, Wifi, WifiOff, AlertTriangle, ChevronRight, X,
  Car, Dog, Phone, ArrowLeft, Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AppSidebar from "@/components/AppSidebar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface TrackID {
  id: string;
  name: string;
  handle: string;
  isPublic: boolean;
  status: "active" | "idle" | "offline";
  lastUpdated: string;
  location: string;
  battery: number;
  assignedUser: string;
  deviceType: "phone" | "pet" | "vehicle";
  lat: number;
  lng: number;
  permissions: { home: boolean; office: boolean; live: boolean };
}

const initialTrackIds: TrackID[] = [
  {
    id: "1", name: "Home", handle: "shivam-home", isPublic: false,
    status: "active", lastUpdated: "2 mins ago", location: "Mumbai, Andheri West",
    battery: 78, assignedUser: "Shivam", deviceType: "phone",
    lat: 19.1176, lng: 72.8562,
    permissions: { home: true, office: false, live: true }
  },
  {
    id: "2", name: "Office", handle: "shivam-office", isPublic: true,
    status: "idle", lastUpdated: "15 mins ago", location: "Mumbai, BKC",
    battery: 45, assignedUser: "Shivam", deviceType: "phone",
    lat: 19.0596, lng: 72.8656,
    permissions: { home: false, office: true, live: false }
  },
  {
    id: "3", name: "Event", handle: "shivam-event", isPublic: true,
    status: "offline", lastUpdated: "3 hours ago", location: "Mumbai, Juhu Beach",
    battery: 12, assignedUser: "Vaishali", deviceType: "phone",
    lat: 19.0883, lng: 72.8263,
    permissions: { home: false, office: false, live: true }
  },
  {
    id: "4", name: "Car GPS", handle: "shivam-car", isPublic: false,
    status: "active", lastUpdated: "Just now", location: "Mumbai, Powai",
    battery: 92, assignedUser: "Shivam", deviceType: "vehicle",
    lat: 19.1197, lng: 72.9051,
    permissions: { home: true, office: true, live: true }
  },
];

const statusConfig = {
  active: { color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10", label: "Active", icon: Wifi },
  idle: { color: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-500/10", label: "Idle", icon: Clock },
  offline: { color: "bg-red-500", text: "text-red-600", bg: "bg-red-500/10", label: "Offline", icon: WifiOff },
};

const deviceIcons = { phone: Phone, pet: Dog, vehicle: Car };

const StatCard = ({ icon: Icon, label, value, color, trend }: { icon: any; label: string; value: number; color: string; trend?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {trend && <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const MiniMap = ({ lat, lng }: { lat: number; lng: number }) => (
  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-muted/30">
    <img
      src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:blue%7C${lat},${lng}&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`}
      alt="Location preview"
      className="w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://mt1.google.com/vt/lyrs=m&x=${Math.floor((lng + 180) / 360 * 256)}&y=${Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * 256)}&z=8`;
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/90 dark:bg-black/70 rounded-lg px-2 py-1">
      <Navigation className="w-3 h-3 text-primary" />
      <span className="text-[10px] font-medium">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
    </div>
  </div>
);

const MyTrackIds = () => {
  const [trackIds, setTrackIds] = useState(initialTrackIds);
  const [creating, setCreating] = useState(false);
  const [editModal, setEditModal] = useState<TrackID | null>(null);
  const [detailView, setDetailView] = useState<TrackID | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", handle: "", isPublic: false, deviceType: "phone" as TrackID["deviceType"],
    permissions: { home: false, office: false, live: true }
  });

  const stats = {
    total: trackIds.length,
    active: trackIds.filter(t => t.status === "active").length,
    offline: trackIds.filter(t => t.status === "offline").length,
    alerts: trackIds.filter(t => t.battery < 20 || t.status === "offline").length,
  };

  const openCreate = () => {
    setForm({ name: "", handle: "", isPublic: false, deviceType: "phone", permissions: { home: false, office: false, live: true } });
    setCreating(true);
    setEditModal(null);
  };

  const openEdit = (tid: TrackID) => {
    setForm({ name: tid.name, handle: tid.handle, isPublic: tid.isPublic, deviceType: tid.deviceType, permissions: { ...tid.permissions } });
    setEditModal(tid);
    setCreating(false);
  };

  const handleSave = () => {
    if (!form.name || !form.handle) { toast.error("Please fill all fields"); return; }
    if (creating) {
      const newId: TrackID = {
        id: Date.now().toString(), ...form,
        status: "active", lastUpdated: "Just now", location: "Mumbai, India",
        battery: 100, assignedUser: "You", lat: 19.076, lng: 72.8777,
        permissions: form.permissions
      };
      setTrackIds(prev => [...prev, newId]);
      toast.success("TrackID created successfully");
    } else if (editModal) {
      setTrackIds(prev => prev.map(t => t.id === editModal.id ? { ...t, ...form } : t));
      toast.success("TrackID updated");
    }
    setCreating(false);
    setEditModal(null);
  };

  const handleDelete = (id: string) => {
    setTrackIds(prev => prev.filter(t => t.id !== id));
    toast.info("TrackID deleted");
  };

  const copyHandle = (handle: string, id: string) => {
    navigator.clipboard.writeText(`@${handle}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    toast.success("Copied to clipboard");
  };

  const showModal = creating || !!editModal;

  // Detail View
  if (detailView) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Button variant="ghost" onClick={() => setDetailView(null)} className="mb-4 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to TrackIDs
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map */}
                <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-border/50 bg-card shadow-sm">
                  <div className="h-80 relative">
                    <iframe
                      src={`https://www.google.com/maps?q=${detailView.lat},${detailView.lng}&z=15&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {detailView.location}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Last updated {detailView.lastUpdated}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                    <h3 className="font-semibold mb-4">Device Details</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Tag, label: "TrackID", value: `@${detailView.handle}` },
                        { icon: User, label: "Assigned To", value: detailView.assignedUser },
                        { icon: Smartphone, label: "Device", value: detailView.deviceType },
                        { icon: MapPin, label: "Location", value: detailView.location },
                      ].map(({ icon: Ic, label, value }) => (
                        <div key={label} className="flex items-center gap-3 text-sm">
                          <Ic className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{label}</span>
                          <span className="ml-auto font-medium capitalize">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                    <h3 className="font-semibold mb-3">Battery</h3>
                    <div className="flex items-center gap-3">
                      <Battery className={`w-5 h-5 ${detailView.battery < 20 ? "text-red-500" : detailView.battery < 50 ? "text-amber-500" : "text-emerald-500"}`} />
                      <Progress value={detailView.battery} className="flex-1 h-2.5" />
                      <span className="text-sm font-bold">{detailView.battery}%</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                    <h3 className="font-semibold mb-3">Location History</h3>
                    <div className="space-y-3">
                      {["10:30 AM — Andheri West", "09:15 AM — Goregaon", "08:00 AM — Malad West", "Yesterday — Borivali"].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-primary" : "bg-muted"}`} />
                            {i < 3 && <div className="w-px h-6 bg-border" />}
                          </div>
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My TrackIDs</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage and monitor all your tracking devices</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative" onClick={() => {
                toast.info("Notifications", { description: `${stats.alerts} alert(s): ${stats.offline} device(s) offline, ${trackIds.filter(t => t.battery < 20).length} low battery` });
              }}>
                <Bell className="w-4 h-4" />
                {stats.alerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                    {stats.alerts}
                  </span>
                )}
              </Button>
              <Button onClick={openCreate} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
                <Plus className="w-4 h-4" /> New TrackID
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Tag} label="Total TrackIDs" value={stats.total} color="bg-blue-500" />
            <StatCard icon={Wifi} label="Active Devices" value={stats.active} color="bg-emerald-500" trend={`${Math.round(stats.active / stats.total * 100)}% online`} />
            <StatCard icon={WifiOff} label="Offline Devices" value={stats.offline} color="bg-red-500" />
            <StatCard icon={AlertTriangle} label="Alerts" value={stats.alerts} color="bg-amber-500" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trackIds.map((tid, i) => {
              const sc = statusConfig[tid.status];
              const StatusIcon = sc.icon;
              const DeviceIcon = deviceIcons[tid.deviceType];

              return (
                <motion.div
                  key={tid.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => setDetailView(tid)}
                >
                  {/* Mini Map */}
                  <MiniMap lat={tid.lat} lng={tid.lng} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                          <DeviceIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{tid.name}</h3>
                          <button
                            onClick={(e) => { e.stopPropagation(); copyHandle(tid.handle, tid.id); }}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                          >
                            @{tid.handle}
                            {copiedId === tid.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <Badge className={`${sc.bg} ${sc.text} border-0 gap-1 text-[10px] font-semibold`}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </Badge>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{tid.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{tid.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span>{tid.assignedUser}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Battery className={`w-3.5 h-3.5 ${tid.battery < 20 ? "text-red-500" : tid.battery < 50 ? "text-amber-500" : "text-emerald-500"}`} />
                        <span className={`font-medium ${tid.battery < 20 ? "text-red-500" : "text-muted-foreground"}`}>{tid.battery}%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                      <Button
                        size="sm" variant="outline"
                        className="flex-1 h-8 text-xs gap-1.5"
                        onClick={(e) => { e.stopPropagation(); navigate("/map"); }}
                      >
                        <Map className="w-3.5 h-3.5" /> View Map
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        className="h-8 text-xs gap-1.5"
                        onClick={(e) => { e.stopPropagation(); openEdit(tid); }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        className="h-8 text-xs gap-1.5"
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`https://trackid.app/@${tid.handle}`); toast.success("Share link copied"); }}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); handleDelete(tid.id); }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Create / Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setCreating(false); setEditModal(null); }}>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">{creating ? "Create New TrackID" : "Edit TrackID"}</h3>
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { setCreating(false); setEditModal(null); }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Name</Label>
                    <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Home, Office, Car" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Handle</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground font-medium">@</span>
                      <Input value={form.handle} onChange={(e) => setForm(f => ({ ...f, handle: e.target.value.toLowerCase().replace(/\s/g, "-") }))} placeholder="shivam-home" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Device Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {([["phone", "Phone", Phone], ["pet", "Pet", Dog], ["vehicle", "Vehicle", Car]] as const).map(([key, label, Icon]) => (
                        <button
                          key={key}
                          onClick={() => setForm(f => ({ ...f, deviceType: key }))}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs font-medium ${form.deviceType === key ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"}`}
                        >
                          <Icon className="w-5 h-5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2">
                      {form.isPublic ? <Globe className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-sm font-medium">{form.isPublic ? "Public" : "Private"}</span>
                    </div>
                    <Switch checked={form.isPublic} onCheckedChange={(v) => setForm(f => ({ ...f, isPublic: v }))} />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => { setCreating(false); setEditModal(null); }}>Cancel</Button>
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" onClick={handleSave}>
                    {creating ? "Create TrackID" : "Save Changes"}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTrackIds;
