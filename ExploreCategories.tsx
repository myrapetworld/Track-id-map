import { motion } from "framer-motion";
import {
  Zap, Globe, Clock, Package, ShieldCheck, AlertTriangle,
} from "lucide-react";

const cats = [
  { icon: Zap, label: "Express", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Globe, label: "International", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Clock, label: "Same Day", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: Package, label: "Heavy Cargo", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: ShieldCheck, label: "Verified", color: "text-primary", bg: "bg-primary/10" },
  { icon: AlertTriangle, label: "Delayed", color: "text-destructive", bg: "bg-destructive/10" },
];

const ExploreCategories = () => (
  <div className="grid grid-cols-3 gap-2">
    {cats.map((c, i) => (
      <motion.button
        key={c.label}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.04 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${c.bg} border border-border/30 transition-colors hover:border-border`}
      >
        <c.icon className={`w-5 h-5 ${c.color}`} />
        <span className="text-[10px] font-medium">{c.label}</span>
      </motion.button>
    ))}
  </div>
);

export default ExploreCategories;
