import { motion } from "framer-motion";
import { TrendingUp, MapPin, Zap, Clock } from "lucide-react";

const trends = [
  {
    icon: Zap,
    label: "Most Active Today",
    value: "Shivam Pandey",
    sub: "12 location shares",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
    border: "border-amber-500/20",
  },
  {
    icon: MapPin,
    label: "Popular Area",
    value: "Goregaon West",
    sub: "28 active users",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-500",
    border: "border-emerald-500/20",
  },
  {
    icon: TrendingUp,
    label: "Trending TrackID",
    value: "@oberoimall",
    sub: "142 views today",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
    border: "border-blue-500/20",
  },
  {
    icon: Clock,
    label: "Fastest Check-in",
    value: "Vaishnavi More",
    sub: "3 min avg response",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
    border: "border-purple-500/20",
  },
];

const TrendingCards = () => (
  <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
    {trends.map((t, i) => (
      <motion.div
        key={t.label}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}
        whileHover={{ scale: 1.03, y: -2 }}
        className={`shrink-0 w-[180px] glass-card p-4 cursor-pointer border ${t.border} bg-gradient-to-br ${t.gradient}`}
      >
        <t.icon className={`w-5 h-5 ${t.iconColor} mb-2`} />
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t.label}</p>
        <p className="text-sm font-bold mt-1 truncate">{t.value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{t.sub}</p>
      </motion.div>
    ))}
  </div>
);

export default TrendingCards;
