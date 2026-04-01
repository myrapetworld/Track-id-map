export interface MockUser {
  id: string;
  name: string;
  trackId: string;
  avatar: string;
  type: "friend" | "public";
  category?: string;
  lat: number;
  lng: number;
  online?: boolean;
}

export const mockFriends: MockUser[] = [
  { id: "1", name: "Shivam Pandey", trackId: "shivampandey", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=shivam", type: "friend", lat: 19.1176, lng: 72.8562, online: true },
  { id: "2", name: "Vaishnavi More", trackId: "vaishnavimore", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=vaishnavi", type: "friend", lat: 19.1230, lng: 72.8480, online: true },
  { id: "3", name: "Vaishali Desai", trackId: "vaishalidesai", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=vaishali", type: "friend", lat: 19.1100, lng: 72.8650, online: false },
  { id: "4", name: "Delivery Guy", trackId: "deliveryguy", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=delivery", type: "friend", lat: 19.1200, lng: 72.8550, online: true },
  { id: "5f", name: "Dheeraj", trackId: "dheeraj01", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=dheeraj", type: "friend", lat: 19.0760, lng: 72.8777, online: true },
  { id: "6f", name: "Sunny Pandey", trackId: "sunnypandey", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sunny", type: "friend", lat: 19.0544, lng: 72.8406, online: false },
  { id: "7f", name: "Vikas", trackId: "vikas99", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=vikas", type: "friend", lat: 19.2183, lng: 72.9781, online: true },
  { id: "8f", name: "Ritesh", trackId: "ritesh21", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ritesh", type: "friend", lat: 19.1663, lng: 72.8526, online: false },
  { id: "9f", name: "OM", trackId: "om_track", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=om", type: "friend", lat: 19.1895, lng: 72.8656, online: true },
];

export const mockPublicPlaces: MockUser[] = [
  { id: "5", name: "Oberoi Mall", trackId: "oberoimall", avatar: "", type: "public", category: "mall", lat: 19.1788, lng: 72.8476 },
  { id: "6", name: "Lords Universal College", trackId: "lordsuniversal", avatar: "", type: "public", category: "education", lat: 19.1123, lng: 72.8367 },
  { id: "7", name: "City Hospital", trackId: "cityhospital", avatar: "", type: "public", category: "hospital", lat: 19.1150, lng: 72.8500 },
  { id: "8", name: "Spice Garden Restaurant", trackId: "spicegarden", avatar: "", type: "public", category: "restaurant", lat: 19.1250, lng: 72.8420 },
  { id: "p1", name: "Marine Drive", trackId: "marinedrive", avatar: "", type: "public", category: "landmark", lat: 18.9432, lng: 72.8235 },
  { id: "p2", name: "Girgaon Chowpatty", trackId: "girgaonchowpatty", avatar: "", type: "public", category: "landmark", lat: 18.9553, lng: 72.8136 },
  { id: "p3", name: "Jawaharnagar", trackId: "jawaharnagar", avatar: "", type: "public", category: "landmark", lat: 19.1850, lng: 72.8480 },
  { id: "p4", name: "Malad", trackId: "malad", avatar: "", type: "public", category: "landmark", lat: 19.1874, lng: 72.8484 },
  { id: "p5", name: "Malwani", trackId: "malwani", avatar: "", type: "public", category: "landmark", lat: 19.1950, lng: 72.8180 },
  { id: "p6", name: "Borivali", trackId: "borivali", avatar: "", type: "public", category: "landmark", lat: 19.2307, lng: 72.8567 },
  { id: "p7", name: "Gateway of India", trackId: "gatewayofindia", avatar: "", type: "public", category: "landmark", lat: 18.9220, lng: 72.8347 },
  { id: "p8", name: "Bandra Worli Sea Link", trackId: "sealink", avatar: "", type: "public", category: "landmark", lat: 19.0300, lng: 72.8155 },
  { id: "p9", name: "Juhu Beach", trackId: "juhubeach", avatar: "", type: "public", category: "landmark", lat: 19.0883, lng: 72.8263 },
  { id: "p10", name: "Powai Lake", trackId: "powailake", avatar: "", type: "public", category: "landmark", lat: 19.1273, lng: 72.9070 },
];

export interface TrackRequest {
  id: string;
  from: MockUser;
  status: "pending" | "approved" | "rejected";
  date: string;
  permissions?: string[];
}

export const mockTrackRequests: TrackRequest[] = [
  { id: "r1", from: mockFriends[0], status: "pending", date: "2026-02-26" },
  { id: "r2", from: mockFriends[1], status: "approved", date: "2026-02-25", permissions: ["home", "live"] },
  { id: "r3", from: mockFriends[2], status: "rejected", date: "2026-02-24" },
];

export const categoryColors: Record<string, string> = {
  mall: "hsl(190, 90%, 50%)",
  education: "hsl(260, 80%, 60%)",
  hospital: "hsl(0, 75%, 55%)",
  restaurant: "hsl(35, 90%, 55%)",
  landmark: "hsl(220, 80%, 55%)",
  friend: "hsl(150, 70%, 50%)",
};

export const categoryIcons: Record<string, string> = {
  mall: "🏬",
  education: "🎓",
  hospital: "🏥",
  restaurant: "🍽️",
  landmark: "📍",
  friend: "👤",
};

// Extended place database for search
export const searchablePlaces: { name: string; lat: number; lng: number; category: string }[] = [
  { name: "Mumbai Central", lat: 18.9712, lng: 72.8194, category: "station" },
  { name: "Churchgate Station", lat: 18.9353, lng: 72.8274, category: "station" },
  { name: "CST (Chhatrapati Shivaji Terminus)", lat: 18.9398, lng: 72.8355, category: "station" },
  { name: "Dadar Station", lat: 19.0178, lng: 72.8432, category: "station" },
  { name: "Andheri Station", lat: 19.1197, lng: 72.8464, category: "station" },
  { name: "Bandra Station", lat: 19.0544, lng: 72.8406, category: "station" },
  { name: "Goregaon Station", lat: 19.1663, lng: 72.8526, category: "station" },
  { name: "Siddhivinayak Temple", lat: 19.0167, lng: 72.8302, category: "temple" },
  { name: "Haji Ali Dargah", lat: 18.9827, lng: 72.8089, category: "landmark" },
  { name: "Nehru Planetarium", lat: 18.9710, lng: 72.8097, category: "landmark" },
  { name: "Sanjay Gandhi National Park", lat: 19.2147, lng: 72.9107, category: "park" },
  { name: "Phoenix Marketcity", lat: 19.0866, lng: 72.8906, category: "mall" },
  { name: "R City Mall", lat: 19.0930, lng: 72.9185, category: "mall" },
  { name: "Inorbit Mall", lat: 19.1400, lng: 72.8388, category: "mall" },
  { name: "Wankhede Stadium", lat: 18.9389, lng: 72.8258, category: "landmark" },
  { name: "Film City", lat: 19.1640, lng: 72.8679, category: "landmark" },
  { name: "IIT Bombay", lat: 19.1334, lng: 72.9133, category: "education" },
  { name: "Kokilaben Hospital", lat: 19.1314, lng: 72.8253, category: "hospital" },
  { name: "Lilavati Hospital", lat: 19.0509, lng: 72.8296, category: "hospital" },
  { name: "Taj Mahal Palace Hotel", lat: 18.9217, lng: 72.8332, category: "hotel" },
  { name: "Colaba Causeway", lat: 18.9067, lng: 72.8061, category: "market" },
  { name: "Crawford Market", lat: 18.9468, lng: 72.8339, category: "market" },
  { name: "Linking Road", lat: 19.0676, lng: 72.8331, category: "market" },
  { name: "Versova Beach", lat: 19.1380, lng: 72.8120, category: "landmark" },
  { name: "Aarey Colony", lat: 19.1560, lng: 72.8740, category: "park" },
];
