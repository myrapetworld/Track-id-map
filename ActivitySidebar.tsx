import { Clock, Search, Bookmark, MapPin } from "lucide-react";

const sections = [
  {
    icon: Search, title: "Recent Searches",
    items: ["Oberoi Mall", "Shivam Pandey", "City Hospital"],
  },
  {
    icon: Clock, title: "Recently Tracked",
    items: ["@shivampandey", "@deliveryguy", "@vaishnavimore"],
  },
  {
    icon: Bookmark, title: "Saved",
    items: ["Spice Garden Restaurant", "Lords Universal College"],
  },
  {
    icon: MapPin, title: "Top Cities",
    items: ["Mumbai", "Pune", "Delhi"],
  },
];

interface ActivitySidebarProps {
  onItemClick?: (item: string) => void;
}

const ActivitySidebar = ({ onItemClick }: ActivitySidebarProps) => (
  <div className="space-y-5">
    {sections.map((s) => (
      <div key={s.title}>
        <div className="flex items-center gap-2 mb-2">
          <s.icon className="w-3.5 h-3.5 text-muted-foreground" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.title}</h4>
        </div>
        <div className="space-y-1">
          {s.items.map((item) => (
            <button
              key={item}
              onClick={() => onItemClick?.(item.replace("@", ""))}
              className="w-full text-left text-sm px-2.5 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ActivitySidebar;
