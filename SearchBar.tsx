import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, MapPin, Loader2 } from "lucide-react";
import { mockFriends, mockPublicPlaces, searchablePlaces, type MockUser, categoryIcons } from "@/lib/mock-data";

interface SearchBarProps {
  onSelect: (user: MockUser) => void;
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const allItems = [...mockFriends, ...mockPublicPlaces];

  // Search both mock items + extended searchable places
  const results = query.length > 0
    ? (() => {
        const q = query.toLowerCase();
        const mockResults = allItems.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.trackId.toLowerCase().includes(q)
        );
        // Also search extended places
        const placeResults: MockUser[] = searchablePlaces
          .filter(p => p.name.toLowerCase().includes(q) && !mockResults.find(m => m.name === p.name))
          .map((p, i) => ({
            id: `search-${i}`,
            name: p.name,
            trackId: p.name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, ""),
            avatar: "",
            type: "public" as const,
            category: p.category,
            lat: p.lat,
            lng: p.lng,
          }));
        return [...mockResults, ...placeResults];
      })()
    : [];

  const showDropdown = focused && (query.length > 0 || true);
  const displayItems = query.length > 0 ? results : allItems.slice(0, 8);

  // Simulate brief search delay for realism
  useEffect(() => {
    if (query.length > 0) {
      setSearching(true);
      const t = setTimeout(() => setSearching(false), 300);
      return () => clearTimeout(t);
    }
    setSearching(false);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !focused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focused]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <div className="glass-card-elevated flex items-center px-4 h-12 gap-3">
          {searching ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search friends, places, or TrackIDs..."
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-secondary px-1.5 text-[10px] text-muted-foreground">
            /
          </kbd>
        </div>

        <AnimatePresence>
          {showDropdown && focused && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 left-0 right-0 glass-card-elevated p-2 max-h-80 overflow-y-auto"
            >
              {query.length === 0 && (
                <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Suggested
                </p>
              )}
              {displayItems.length === 0 ? (
                <p className="px-3 py-4 text-sm text-muted-foreground text-center">No results found</p>
              ) : (
                displayItems.map((item) => (
                  <button
                    key={item.id}
                    onMouseDown={() => {
                      onSelect(item);
                      setQuery("");
                      setFocused(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors text-left"
                  >
                    {item.type === "friend" ? (
                      <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full bg-secondary" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm">
                        {categoryIcons[item.category || ""] || "📍"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">@{item.trackId}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {item.type === "friend" ? (
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Friend</span>
                      ) : (
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.category}</span>
                      )}
                    </span>
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar;
