export interface ConciergeEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  price: string;
  description: string;
  source: string;
  coords: [number, number];
  gradient: string;
}

export const USER_LOCATION: [number, number] = [45.4215, -75.6972];

export const MOCK_EVENTS: ConciergeEvent[] = [
  {
    id: 1,
    title: "Night Market at Lansdowne",
    category: "Food + Local",
    date: "Friday, Jun 12",
    time: "6:00 PM - 10:00 PM",
    location: "Lansdowne Park",
    distance: "3.2 km away",
    price: "Free entry",
    description: "Outdoor food stalls, local makers, live music, and low-pressure wandering time.",
    source: "Mock event data migrated from Couple-Event-Finder UX patterns",
    coords: [45.3995, -75.6832],
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
  {
    id: 2,
    title: "Couples Pottery Workshop",
    category: "Workshop",
    date: "Saturday, Jun 13",
    time: "2:00 PM - 4:00 PM",
    location: "Clay & Co Studio",
    distance: "5 km away",
    price: "$65 per person",
    description: "Hands-on pottery session designed for pairs, with a take-home piece after firing.",
    source: "Mock event data migrated from Couple-Event-Finder UX patterns",
    coords: [45.429, -75.69],
    gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
  },
  {
    id: 3,
    title: "Indie Comedy Night",
    category: "Comedy",
    date: "Sunday, Jun 14",
    time: "8:00 PM - 10:00 PM",
    location: "ByWard Cellar Stage",
    distance: "1.8 km away",
    price: "$18",
    description: "A small venue lineup with quick sets, snacks nearby, and an easy post-show walk.",
    source: "Mock event data migrated from Couple-Event-Finder UX patterns",
    coords: [45.428, -75.692],
    gradient: "from-sky-500 via-indigo-500 to-purple-600",
  },
];
