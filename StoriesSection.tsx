import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { mockFriends, type MockUser } from "@/lib/mock-data";

const stories = [
  { id: "s1", user: mockFriends[0], type: "live", label: "Live Now", gradient: "from-green-500 to-emerald-400" },
  { id: "s2", user: mockFriends[1], type: "update", label: "Checked In", gradient: "from-pink-500 to-rose-400" },
  { id: "s3", user: mockFriends[2], type: "alert", label: "New Alert", gradient: "from-amber-500 to-orange-400" },
  { id: "s4", user: mockFriends[3], type: "delivery", label: "En Route", gradient: "from-blue-500 to-cyan-400" },
  { id: "s5", user: { ...mockFriends[0], name: "Your Story", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=you" } as MockUser, type: "add", label: "Add Story", gradient: "from-primary to-accent" },
];

const storyContents: Record<string, { title: string; subtitle: string; bg: string }[]> = {
  s1: [
    { title: "📍 Sharing Live Location", subtitle: "Goregaon West, Mumbai", bg: "from-green-900/80 to-emerald-900/80" },
    { title: "🚗 On the move", subtitle: "Heading towards Andheri Station", bg: "from-teal-900/80 to-cyan-900/80" },
  ],
  s2: [
    { title: "☕ Checked in at Starbucks", subtitle: "Infiniti Mall, Malad", bg: "from-pink-900/80 to-rose-900/80" },
  ],
  s3: [
    { title: "🔔 Location Alert", subtitle: "Vaishali left home zone", bg: "from-amber-900/80 to-orange-900/80" },
  ],
  s4: [
    { title: "📦 Delivery on the way", subtitle: "ETA: 15 mins • 2.3 km away", bg: "from-blue-900/80 to-indigo-900/80" },
  ],
};

const StoriesSection = () => {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);

  const openStory = (id: string) => {
    if (id === "s5") return;
    setActiveStory(id);
    setStoryIndex(0);
  };

  const currentSlides = activeStory ? storyContents[activeStory] || [] : [];

  const nextSlide = () => {
    if (storyIndex < currentSlides.length - 1) setStoryIndex((i) => i + 1);
    else setActiveStory(null);
  };

  const prevSlide = () => {
    if (storyIndex > 0) setStoryIndex((i) => i - 1);
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto scrollbar-none py-1 px-1">
        {stories.map((story, i) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openStory(story.id)}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div className={`p-[2.5px] rounded-full bg-gradient-to-br ${story.gradient}`}>
              <div className="p-[2px] rounded-full bg-background">
                <img
                  src={story.user.avatar}
                  alt={story.user.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground max-w-[64px] truncate">
              {story.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Fullscreen Story Viewer */}
      <AnimatePresence>
        {activeStory && currentSlides.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={nextSlide}
          >
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {currentSlides.map((_, idx) => (
                <div key={idx} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: idx <= storyIndex ? "100%" : "0%" }}
                    transition={{ duration: idx === storyIndex ? 4 : 0 }}
                    onAnimationComplete={() => {
                      if (idx === storyIndex) nextSlide();
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setActiveStory(null); }}
              className="absolute top-8 right-4 z-10 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nav */}
            {storyIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={storyIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${currentSlides[storyIndex].bg} p-8`}
              >
                <h2 className="text-3xl font-bold text-white mb-3 text-center">{currentSlides[storyIndex].title}</h2>
                <p className="text-white/70 text-lg text-center">{currentSlides[storyIndex].subtitle}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoriesSection;
