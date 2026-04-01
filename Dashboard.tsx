import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Clock, Check, X, Shield, Radio, Eye, EyeOff,
  Home, Briefcase, MapPin, Pencil, Navigation, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppSidebar from "@/components/AppSidebar";
import { useUser, type FriendRequest } from "@/lib/user-context";
import { mockFriends } from "@/lib/mock-data";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, isTrackingOn, toggleTracking, friendRequests, acceptRequest, rejectRequest } = useUser();
  const [permissionModal, setPermissionModal] = useState<string | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<"current" | "home" | "office">("current");

  const pending = friendRequests.filter(r => r.status === "pending");
  const accepted = friendRequests.filter(r => r.status === "accepted");
  const trackingMe = mockFriends.filter(f => f.online).slice(0, 3);

  const stats = [
    { label: "Active Trackers", value: accepted.length, icon: Radio, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Requests", value: pending.length, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Total Friends", value: friendRequests.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Tracking", value: isTrackingOn ? "LIVE" : "OFF", icon: Eye, color: isTrackingOn ? "text-emerald-400" : "text-muted-foreground", bg: isTrackingOn ? "bg-emerald-400/10" : "bg-muted/10" },
  ];

  const handleApprove = (id: string) => setPermissionModal(id);

  const confirmApprove = () => {
    if (permissionModal) {
      acceptRequest(permissionModal, selectedPermission);
      setPermissionModal(null);
      toast.success("Request approved!");
    }
  };

  const handleReject = (id: string) => {
    rejectRequest(id);
    toast.info("Request rejected");
  };

  const permissionLabel = (p?: string) => {
    if (p === "current") return "Live Location";
    if (p === "home") return "Home Address";
    if (p === "office") return "Office Address";
    return p;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold">Dashboard</h1>
              {user && <p className="text-sm text-muted-foreground">Welcome, {user.fullName} · @{user.trackId}</p>}
            </div>
            {/* Track Me Toggle */}
            <button
              onClick={() => { toggleTracking(); toast.success(isTrackingOn ? "Tracking stopped" : "Live tracking started!"); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isTrackingOn
                  ? "gradient-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {isTrackingOn && <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" /></span>}
              <Navigation className="w-4 h-4" />
              {isTrackingOn ? "Tracking LIVE" : "Track Me"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-4 hover:scale-[1.03] transition-transform duration-200 cursor-default group">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-display font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6 bg-secondary/50 rounded-xl p-1 h-auto">
              <TabsTrigger value="requests" className="rounded-lg py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Clock className="w-3.5 h-3.5 mr-1.5" /> Requests ({pending.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-lg py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Check className="w-3.5 h-3.5 mr-1.5" /> Accepted ({accepted.length})
              </TabsTrigger>
              <TabsTrigger value="tracking-me" className="rounded-lg py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Shield className="w-3.5 h-3.5 mr-1.5" /> Tracking Me ({trackingMe.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <div className="space-y-3">
                {pending.length === 0 && <EmptyState text="No pending requests 🎉" />}
                {pending.map(req => (
                  <FriendRequestCard key={req.id} req={req}>
                    <Button size="sm" onClick={() => handleApprove(req.id)} className="gradient-primary text-primary-foreground text-xs h-8">
                      <Check className="w-3 h-3 mr-1" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(req.id)} className="text-xs h-8 border-border/50">
                      <X className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  </FriendRequestCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved">
              <div className="space-y-3">
                {accepted.length === 0 && <EmptyState text="No accepted friends yet" />}
                {accepted.map(req => (
                  <FriendRequestCard key={req.id} req={req}>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                      {req.permissionType === "current" && <MapPin className="w-3 h-3" />}
                      {req.permissionType === "home" && <Home className="w-3 h-3" />}
                      {req.permissionType === "office" && <Briefcase className="w-3 h-3" />}
                      Sharing: {permissionLabel(req.permissionType)}
                    </span>
                  </FriendRequestCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tracking-me">
              <div className="space-y-3">
                {trackingMe.length === 0 && <EmptyState text="Nobody is tracking you" />}
                {trackingMe.map(u => (
                  <div key={u.id} className="glass-card p-4 flex items-center gap-4">
                    <div className="relative">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">@{u.trackId} · <span className="text-emerald-500">Live</span></p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-8 text-destructive border-destructive/30"
                      onClick={() => toast.info(`Stopped sharing with ${u.name}`)}>
                      <EyeOff className="w-3 h-3 mr-1" /> Stop Sharing
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Permission Modal */}
        <AnimatePresence>
          {permissionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-card-elevated p-6 w-full max-w-sm mx-4">
                <h3 className="font-display font-bold text-lg mb-2">Allow Location Sharing?</h3>
                <p className="text-sm text-muted-foreground mb-5">Choose what location to share with this user:</p>
                <div className="space-y-2">
                  {([
                    { key: "current" as const, icon: MapPin, label: "Current Live Location", desc: "Share your real-time GPS location" },
                    { key: "home" as const, icon: Home, label: "Home Location", desc: "Share your saved home address" },
                    { key: "office" as const, icon: Briefcase, label: "Office Location", desc: "Share your saved office address" },
                  ]).map(({ key, icon: Icon, label, desc }) => (
                    <button key={key}
                      onClick={() => setSelectedPermission(key)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                        selectedPermission === key
                          ? "bg-primary/10 border-primary/30 text-foreground"
                          : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
                      }`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedPermission === key ? "gradient-primary" : "bg-secondary"}`}>
                        <Icon className={`w-4 h-4 ${selectedPermission === key ? "text-primary-foreground" : ""}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-[11px] text-muted-foreground">{desc}</p>
                      </div>
                      {selectedPermission === key && <Check className="w-4 h-4 text-primary ml-auto" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setPermissionModal(null)}>Cancel</Button>
                  <Button className="flex-1 gradient-primary text-primary-foreground" onClick={confirmApprove}>Confirm</Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function FriendRequestCard({ req, children }: { req: FriendRequest; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4 flex items-center gap-4">
      <img src={req.avatar} alt={req.username} className="w-10 h-10 rounded-full" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{req.username}</p>
        <p className="text-xs text-muted-foreground">@{req.trackId}</p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </motion.div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground py-8 text-center">{text}</p>;
}

export default Dashboard;
