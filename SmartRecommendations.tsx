import { motion } from "framer-motion";
import { Sparkles, MapPin, Users, Eye } from "lucide-react";

const recs = [
  { icon: MapPin, label: "Near you", items: ["Oberoi Mall", "City Hospital", "Spice Garden"], color: "text-primary" },
  { icon: Users, label: "Popular in Mumbai", items: ["@oberoimall", "@lordsuniversal", "@cityhospital"], color: "text-emerald-500" },
  { icon: Eye, label: "Recently viewed", items: ["Shivam Pandey", "Vaishnavi More"], color: "text-amber-500" },
];

const SmartRecommendations = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-primary" />
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Smart Suggestions</h3>
    </div>
    {recs.map((rec, i) => (
      <motion.div
        key={rec.label}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="glass-card p-3"
      >
        <div className="flex items-center gap-2 mb-2">
          <rec.icon className={`w-3.5 h-3.5 ${rec.color}`} />
          <span className="text-xs font-medium">{rec.label}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {rec.items.map((item) => (
            <span
              key={item}
              className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/60 text-foreground hover:bg-secondary cursor-pointer transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);

export default SmartRecommendations;
