import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  avatar: string;
  name: string;
  text: string;
  timeAgo: string;
  likes: number;
  liked?: boolean;
}

const mockComments: Record<string, Comment[]> = {
  default: [
    { id: "c1", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priya", name: "Priya Sharma", text: "Stay safe! 🙌", timeAgo: "2m", likes: 3 },
    { id: "c2", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=rahul", name: "Rahul Mehta", text: "Almost there, see you soon!", timeAgo: "5m", likes: 1 },
  ],
};

const FeedComments = ({ feedId, commentCount }: { feedId: string; commentCount: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(() => mockComments.default.slice(0, commentCount || 2));
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = () => {
    const text = newComment.trim();
    if (!text) return;
    const comment: Comment = {
      id: `new-${Date.now()}`,
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=you",
      name: "You",
      text,
      timeAgo: "now",
      likes: 0,
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  const toggleLikeComment = (id: string) =>
    setLikedComments((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  return (
    <div>
      {/* Toggle */}
      {commentCount > 0 && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-3 pb-2"
        >
          View all {comments.length} comments
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Comment list */}
            <div className="px-3 space-y-2.5 max-h-44 overflow-y-auto scrollbar-none">
              {comments.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2 group/comment"
                >
                  <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <span className="font-semibold text-foreground">{c.name}</span>{" "}
                      <span className="text-muted-foreground">{c.text}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{c.timeAgo}</span>
                      <button
                        onClick={() => toggleLikeComment(c.id)}
                        className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Heart
                          className={`w-2.5 h-2.5 ${likedComments.has(c.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {c.likes + (likedComments.has(c.id) ? 1 : 0)}
                      </button>
                      <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover/comment:opacity-100">
                        Reply
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2 mt-1 border-t border-border/50">
              <img
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=you"
                alt="You"
                className="w-6 h-6 rounded-full shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 shrink-0"
                disabled={!newComment.trim()}
                onClick={handleSubmit}
              >
                <Send className={`w-3.5 h-3.5 transition-colors ${newComment.trim() ? "text-primary" : "text-muted-foreground"}`} />
              </Button>
            </div>

            {/* Collapse */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-[10px] text-muted-foreground hover:text-foreground text-center py-1 transition-colors"
            >
              Hide comments
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline quick-add when closed */}
      {!isOpen && (
        <div className="flex items-center gap-2 px-3 pb-2">
          <img
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=you"
            alt="You"
            className="w-5 h-5 rounded-full shrink-0"
          />
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-[11px] outline-none text-foreground placeholder:text-muted-foreground"
            onFocus={() => setIsOpen(true)}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default FeedComments;
