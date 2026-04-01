import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Bell, MapPin, Star, Clock, Navigation, Bookmark,
  Users, Sparkles, TrendingUp, ChevronRight, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppSidebar from "@/components/AppSidebar";
import StoriesSection from "@/components/explore/StoriesSection";
import TrendingCards from "@/components/explore/TrendingCards";
import LiveFeed from "@/components/explore/LiveFeed";
import SmartRecommendations from "@/components/explore/SmartRecommendations";
import { mockFriends, mockPublicPlaces, searchablePlaces, type MockUser } from "@/lib/mock-data";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const categories = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "friends", label: "Friends", icon: Users },
  { key: "nearby", label: "Nearby Users", icon: MapPin },
  { key: "popular", label: "Popular Places", icon: Star },
  { key: "recent", label: "Recently Active", icon: Clock },
];

const trendingUsers = [
  { name: "Shivam Pandey", trackId: "shivampandey", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=shivam", lat: 19.1176, lng: 72.8562, views: 234 },
  { name: "Vaishnavi More", trackId: "vaishnavimore", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=vaishnavi", lat: 19.1230, lng: 72.8480, views: 189 },
  { name: "Dheeraj Kumar", trackId: "dheeraj01", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=dheeraj", lat: 19.0760, lng: 72.8777, views: 156 },
  { name: "OM Patel", trackId: "om_track", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=om", lat: 19.1895, lng: 72.8656, views: 142 },
];

const trendingPlaces = [
  { name: "Marine Drive", desc: "Iconic waterfront promenade", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=200&fit=crop", lat: 18.9432, lng: 72.8235, rating: 4.8 },
  { name: "Gateway of India", desc: "Historic arch monument", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=200&fit=crop", lat: 18.9220, lng: 72.8347, rating: 4.9 },
  { name: "Juhu Beach", desc: "Popular beach with street food", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop", lat: 19.0883, lng: 72.8263, rating: 4.3 },
  { name: "Bandra Worli Sea Link", desc: "Engineering marvel over the sea", img: "https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=400&h=200&fit=crop", lat: 19.0300, lng: 72.8155, rating: 4.6 },
];

const travelRoutes = [
  { name: "Marine Drive Loop", from: "Churchgate", to: "Marine Drive", distance: "3.2 km", time: "12 min", lat: 18.9432, lng: 72.8235 },
  { name: "Bandra Food Trail", from: "Bandra Station", to: "Linking Road", distance: "1.8 km", time: "8 min", lat: 19.0544, lng: 72.8406 },
  { name: "South Mumbai Heritage", from: "CST", to: "Gateway of India", distance: "2.5 km", time: "10 min", lat: 18.9220, lng: 72.8347 },
];

const mockNotifications = [
  { id: "n1", text: "Dheeraj shared their location with you", time: "2m ago", read: false },
  { id: "n2", text: "Device 'Car GPS' went offline", time: "15m ago", read: false },
  { id: "n3", text: "Vaishnavi More accepted your track request", time: "1h ago", read: true },
  { id: "n4", text: "Battery low on 'Office' device (12%)", time: "2h ago", read: true },
];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const allItems = useMemo(() => [...mockFriends, ...mockPublicPlaces], []);

  const filtered = useMemo(() => {
    let items = allItems;
    if (activeCategory === "friends") items = items.filter(i => i.type === "friend");
    else if (activeCategory === "nearby") items = items.filter(i => i.type === "friend" && i.online);
    else if (activeCategory === "popular") items = items.filter(i => i.type === "public");
    else if (activeCategory === "recent") items = items.filter(i => i.type === "friend").slice(0, 5);

    if (query) {
      const q = query.toLowerCase();
      const mockResults = items.filter(i => i.name.toLowerCase().includes(q) || i.trackId.toLowerCase().includes(q));
      const extendedResults: MockUser[] = searchablePlaces
        .filter(p => p.name.toLowerCase().includes(q) && !mockResults.find(m => m.name === p.name))
        .map((p, i) => ({
          id: `ext-${i}`, name: p.name, trackId: p.name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, ""),
          avatar: "", type: "public" as const, category: p.category, lat: p.lat, lng: p.lng,
        }));
      return [...mockResults, ...extendedResults];
    }
    return items;
  }, [allItems, activeCategory, query]);

  const goToMap = (lat: number, lng: number, name: string, trackId?: string, avatar?: string) => {
    const params = new URLSearchParams({
      lat: lat.toString(), lng: lng.toString(), name,
      ...(trackId && { trackId }),
      ...(avatar && { avatar }),
    });
    navigate(`/map?${params.toString()}`);
    toast.success(`Opening ${name} on map`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border p-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="glass-card flex items-center px-4 h-10 gap-3 flex-1">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input type="text" placeholder="Search people, places, TrackIDs..." className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" value={query} onChange={(e) => setQuery(e.target.value)} />
              {query && <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
            </div>
            <div className="relative">
              <Button variant="ghost" size="icon" className="h-10 w-10 relative" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-[9px] text-white flex items-center justify-center font-bold">{unreadCount}</span>}
              </Button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-12 w-72 z-50 bg-card border border-border rounded-xl shadow-xl p-2">
                    <p className="text-xs font-semibold px-2 py-1.5 text-muted-foreground uppercase tracking-wider">Notifications</p>
                    {notifications.map(n => (
                      <button key={n.id} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-secondary/50 ${!n.read ? "bg-primary/5" : ""}`}
                        onClick={() => { setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); setShowNotifications(false); }}>
                        <p className="text-xs">{n.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-4 space-y-8">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat.key ? "gradient-primary text-primary-foreground shadow-sm scale-105" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground hover:scale-105"
                }`}>
                <cat.icon className="w-3.5 h-3.5" /> {cat.label}
              </button>
            ))}
          </div>

          <StoriesSection />

          {/* Trending Users */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Trending Users
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {trendingUsers.map((u, i) => (
                <motion.div key={u.trackId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className="glass-card p-4 cursor-pointer text-center group" onClick={() => goToMap(u.lat, u.lng, u.name, u.trackId, u.avatar)}>
                  <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-full mx-auto mb-2 group-hover:ring-2 ring-primary/50 transition-all" />
                  <p className="text-sm font-semibold truncate">{u.name}</p>
                  <p className="text-[11px] text-muted-foreground">@{u.trackId}</p>
                  <Button size="sm" variant="outline" className="text-[10px] h-7 mt-2 w-full group-hover:gradient-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all"
                    onClick={(e) => { e.stopPropagation(); goToMap(u.lat, u.lng, u.name, u.trackId, u.avatar); }}>
                    <Eye className="w-3 h-3 mr-1" /> View Location
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Trending Places */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Popular Places
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingPlaces.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card overflow-hidden cursor-pointer group" onClick={() => goToMap(p.lat, p.lng, p.name)}>
                  <div className="h-36 overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <span className="flex items-center gap-1 text-xs text-yellow-500"><Star className="w-3 h-3" /> {p.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-xs h-7 flex-1" onClick={(e) => { e.stopPropagation(); goToMap(p.lat, p.lng, p.name); }}>
                        <MapPin className="w-3 h-3 mr-1" /> Open Map
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7 px-2" onClick={(e) => { e.stopPropagation(); toast.success(`${p.name} bookmarked`); }}>
                        <Bookmark className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <TrendingCards />

          {/* Travel Suggestions */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Travel Routes
            </h2>
            <div className="space-y-2">
              {travelRoutes.map((r, i) => (
                <motion.button key={i} whileHover={{ scale: 1.01 }} onClick={() => goToMap(r.lat, r.lng, r.name)}
                  className="w-full glass-card p-3 text-left flex items-center gap-3 hover:bg-secondary/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.from} → {r.to} · {r.distance} · ~{r.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </section>

          {/* Friends List */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> {activeCategory === "all" ? "All People & Places" : categories.find(c => c.key === activeCategory)?.label}
            </h2>
            <div className="space-y-2">
              {filtered.slice(0, 12).map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="glass-card p-3 flex items-center gap-3 cursor-pointer hover:bg-secondary/30 transition-all hover:scale-[1.01]"
                  onClick={() => goToMap(item.lat, item.lng, item.name)}>
                  <div className="relative">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-primary" /></div>
                    )}
                    {item.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">@{item.trackId} {item.online !== undefined && (item.online ? <span className="text-emerald-500">· Online</span> : "· Offline")}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7 hover:gradient-primary hover:text-primary-foreground hover:border-transparent transition-all"
                    onClick={(e) => { e.stopPropagation(); goToMap(item.lat, item.lng, item.name); }}>
                    <Eye className="w-3 h-3 mr-1" /> View
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>

          <SmartRecommendations />

          {/* Feed */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">📰 Live Feed</h2>
            <LiveFeed onLocate={(id) => { navigate(`/map?lat=${19.07 + Math.random() * 0.1}&lng=${72.85 + Math.random() * 0.05}&name=Feed+Location`); }} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
