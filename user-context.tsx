import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  trackId: string;
  accountType: "public" | "private";
  avatar: string;
  homeAddress: string;
  officeAddress: string;
  locationEnabled: boolean;
}

export interface FriendRequest {
  id: string;
  username: string;
  trackId: string;
  avatar: string;
  status: "pending" | "accepted" | "rejected";
  permissionType?: "current" | "home" | "office";
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile) => void;
  isTrackingOn: boolean;
  toggleTracking: () => void;
  friendRequests: FriendRequest[];
  acceptRequest: (id: string, permission: "current" | "home" | "office") => void;
  rejectRequest: (id: string) => void;
}

const defaultRequests: FriendRequest[] = [
  { id: "fr1", username: "Dheeraj Kumar", trackId: "dheeraj01", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=dheeraj", status: "pending" },
  { id: "fr2", username: "Sunny Pandey", trackId: "sunnypandey", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sunny", status: "pending" },
  { id: "fr3", username: "Vikas Sharma", trackId: "vikas99", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=vikas", status: "pending" },
  { id: "fr4", username: "Ritesh Patil", trackId: "ritesh21", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ritesh", status: "pending" },
  { id: "fr5", username: "OM Patel", trackId: "om_track", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=om", status: "pending" },
];

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("trackid_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isTrackingOn, setIsTrackingOn] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(defaultRequests);

  const setUser = useCallback((u: UserProfile) => {
    setUserState(u);
    localStorage.setItem("trackid_user", JSON.stringify(u));
  }, []);

  const toggleTracking = useCallback(() => setIsTrackingOn(p => !p), []);

  const acceptRequest = useCallback((id: string, permission: "current" | "home" | "office") => {
    setFriendRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "accepted" as const, permissionType: permission } : r)
    );
  }, []);

  const rejectRequest = useCallback((id: string) => {
    setFriendRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "rejected" as const } : r)
    );
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isTrackingOn, toggleTracking, friendRequests, acceptRequest, rejectRequest }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
