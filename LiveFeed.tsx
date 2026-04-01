import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Bookmark, MapPin, Navigation,
  ArrowRight, Wifi, Loader2, Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FeedComments from "./FeedComments";
import { toast } from "sonner";

interface FeedItem {
  id: string;
  avatar: string;
  name: string;
  trackId: string;
  from: string;
  to: string;
  status: "live" | "arrived" | "en-route";
  timeAgo: string;
  likes: number;
  comments: number;
  mapThumb: string;
  isNew?: boolean;
}

const initialFeed: FeedItem[] = [
  { id: "f1", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=shivam", name: "Shivam Pandey", trackId: "@shivampandey", from: "Malad West", to: "Goregaon Station", status: "live", timeAgo: "2 min ago", likes: 24, comments: 5, mapThumb: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop" },
  { id: "f2", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=vaishnavi", name: "Vaishnavi More", trackId: "@vaishnavimore", from: "Andheri East", to: "Oberoi Mall", status: "arrived", timeAgo: "18 min ago", likes: 12, comments: 2, mapThumb: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=200&fit=crop" },
  { id: "f3", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=delivery", name: "Delivery Guy", trackId: "@deliveryguy", from: "Kandivali", to: "Your Location", status: "en-route", timeAgo: "5 min ago", likes: 8, comments: 1, mapThumb: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=200&fit=crop" },
];

const incomingPool: Omit<FeedItem, "id" | "isNew">[] = [
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priya", name: "Priya Sharma", trackId: "@priyasharma", from: "Bandra West", to: "Juhu Beach", status: "live", timeAgo: "Just now", likes: 3, comments: 0, mapThumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop" },
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=rahul", name: "Rahul Mehta", trackId: "@rahulmehta", from: "Powai", to: "BKC", status: "en-route", timeAgo: "Just now", likes: 1, comments: 0, mapThumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=200&fit=crop" },
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=anita", name: "Anita Kulkarni", trackId: "@anitak", from: "Thane", to: "Dadar", status: "arrived", timeAgo: "Just now", likes: 7, comments: 2, mapThumb: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop" },
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=arjun", name: "Arjun Nair", trackId: "@arjunnair", from: "Worli", to: "Lower Parel", status: "live", timeAgo: "Just now", likes: 0, comments: 0, mapThumb: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=200&fit=crop" },
];

const olderPool: Omit<FeedItem, "id" | "isNew">[] = [
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=meera", name: "Meera Joshi", trackId: "@meeraj", from: "Borivali", to: "Churchgate", status: "arrived", timeAgo: "1h ago", likes: 15, comments: 3, mapThumb: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=200&fit=crop" },
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=karan", name: "Karan Singh", trackId: "@karansingh", from: "Versova", to: "Lokhandwala", status: "live", timeAgo: "1h ago", likes: 9, comments: 1, mapThumb: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400&h=200&fit=crop" },
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sneha", name: "Sneha Patil", trackId: "@snehapatil", from: "Mulund", to: "Ghatkopar", status: "en-route", timeAgo: "2h ago", likes: 5, comments: 0, mapThumb: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=200&fit=crop" },
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=vikram", name: "Vikram Rao", trackId: "@vikramrao", from: "Colaba", to: "Marine Drive", status: "arrived", timeAgo: "3h ago", likes: 21, comments: 4, mapThumb: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=200&fit=crop" },
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=divya", name: "Divya Kapoor", trackId: "@divyak", from: "Santacruz", to: "Vile Parle", status: "live", timeAgo: "3h ago", likes: 11, comments: 2, mapThumb: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=400&h=200&fit=crop" },
  { avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=nikhil", name: "Nikhil Verma", trackId: "@nikhilv", from: "Dahisar", to: "Mira Road", status: "en-route", timeAgo: "4h ago", likes: 4, comments: 0, mapThumb: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=200&fit=crop" },
];

const statusConfig = {
  live: { label: "🟢 Live", bg: "bg-green-500/10 text-green-500 border-green-500/20" },
  arrived: { label: "✅ Arrived", bg: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  "en-route": { label: "🚀 En Route", bg: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
};

const FeedSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <div className="flex items-center gap-3 p-3 pb-2">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-2.5 w-40" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <div className="px-3 pb-2">
      <Skeleton className="h-3 w-48" />
    </div>
    <div className="mx-3 mb-2">
      <Skeleton className="h-36 w-full rounded-lg" />
    </div>
    <div className="flex items-center justify-between px-3 py-2 border-t border-border/50">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  </div>
);

const LiveFeed = ({ onLocate }: { onLocate?: (id: string) => void }) => {
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const poolIndex = useRef(0);
  const olderIndex = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const incoming = incomingPool[poolIndex.current % incomingPool.length];
      poolIndex.current++;
      const newItem: FeedItem = { ...incoming, id: `live-${Date.now()}`, isNew: true };
      setFeed((prev) => [newItem, ...prev.slice(0, 19)]);
    }, 6000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            const batch: FeedItem[] = [];
            for (let i = 0; i < 3; i++) {
              if (olderIndex.current >= olderPool.length) {
                setHasMore(false);
                break;
              }
              batch.push({
                ...olderPool[olderIndex.current],
                id: `older-${olderIndex.current}-${Date.now()}`,
              });
              olderIndex.current++;
            }
            setFeed((prev) => [...prev, ...batch]);
            setIsLoadingMore(false);
          }, 1200);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  const toggleLike = (id: string) => setLiked((prev) => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });
  const toggleSave = (id: string) => setSaved((prev) => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });

  const handleShare = (item: FeedItem) => {
    const shareLink = `https://trackid.com/route/${item.id}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Share link copied!", { description: shareLink });
  };

  const handleViewRoute = (item: FeedItem) => {
    onLocate?.(item.id);
    toast.success(`Viewing route: ${item.from} → ${item.to}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsLive((v) => !v)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
            isLive ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
          }`}
        >
          <Wifi className="w-3 h-3" />
          {isLive ? "Live Updates On" : "Live Updates Off"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {feed.map((item) => {
          const st = statusConfig[item.status];
          return (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`glass-card overflow-hidden group ${item.isNew ? "ring-1 ring-primary/30" : ""}`}
            >
              <div className="flex items-center gap-3 p-3 pb-2">
                <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full ring-2 ring-primary/20" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.trackId} · {item.timeAgo}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${st.bg}`}>
                  {st.label}
                </span>
              </div>
              <div className="px-3 pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="font-medium text-foreground">{item.from}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span className="font-medium text-foreground">{item.to}</span>
                </div>
              </div>
              <div className="relative h-36 overflow-hidden mx-3 rounded-lg mb-2">
                <img src={item.mapThumb} alt="Route preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 right-2 flex gap-1.5">
                  <Button size="sm" variant="secondary" className="text-[10px] h-6 px-2 bg-background/80 backdrop-blur-sm" onClick={() => handleViewRoute(item)}>
                    <Navigation className="w-3 h-3 mr-1" /> View Route
                  </Button>
                  <Button size="sm" variant="secondary" className="text-[10px] h-6 px-2 bg-background/80 backdrop-blur-sm" onClick={() => handleShare(item)}>
                    <Link2 className="w-3 h-3 mr-1" /> Share
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(item.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className={`w-4 h-4 transition-colors ${liked.has(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                    {item.likes + (liked.has(item.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="w-4 h-4" /> {item.comments}
                  </button>
                  <button onClick={() => handleShare(item)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => toggleSave(item.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Bookmark className={`w-4 h-4 ${saved.has(item.id) ? "fill-primary text-primary" : ""}`} />
                </button>
              </div>
              <FeedComments feedId={item.id} commentCount={item.comments} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {hasMore && (
        <div ref={sentinelRef} className="space-y-4">
          {isLoadingMore && (
            <>
              <FeedSkeleton />
              <FeedSkeleton />
            </>
          )}
          {!isLoadingMore && (
            <div className="flex justify-center py-2">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          )}
        </div>
      )}

      {!hasMore && (
        <p className="text-center text-xs text-muted-foreground py-4">You're all caught up!</p>
      )}
    </div>
  );
};

export default LiveFeed;
