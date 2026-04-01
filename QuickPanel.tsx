import { motion } from "framer-motion";
import { Users, MapPin, Navigation } from "lucide-react";
import { mockFriends, mockPublicPlaces, type MockUser } from "@/lib/mock-data";

interface QuickPanelProps {
  onLocate: (user: MockUser) => void;
}

const QuickPanel = ({ onLocate }: QuickPanelProps) => {
  const onlineFriends = mockFriends.filter((f) => f.online);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="absolute bottom-4 left-4 right-4 z-10"
    >
      <div className="glass-card-elevated p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Nearby Friends
          </h3>
          <span className="text-xs text-muted-foreground">{onlineFriends.length} online</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {mockFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onLocate(friend)}
              className="shrink-0 flex flex-col items-center gap-1.5 group"
            >
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full border-2 border-border group-hover:border-primary transition-colors"
                />
                {friend.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors max-w-[60px] truncate">
                {friend.name.split(" ")[0]}
              </span>
            </button>
          ))}
          <div className="shrink-0 w-px bg-border my-1" />
          {mockPublicPlaces.slice(0, 3).map((place) => (
            <button
              key={place.id}
              onClick={() => onLocate(place)}
              className="shrink-0 flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors max-w-[60px] truncate">
                {place.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickPanel;
