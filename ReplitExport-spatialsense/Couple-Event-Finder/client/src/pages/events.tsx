import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin, Calendar, Clock, Undo2, Share2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import eventMusic from "@/assets/images/event-music.png";
import eventPottery from "@/assets/images/event-pottery.png";
import eventFood from "@/assets/images/event-food.png";
import eventCarshow from "@/assets/images/event-carshow.png";
import eventComedy from "@/assets/images/event-comedy.png";
import eventMarket from "@/assets/images/event-market.png";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for the user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// User location (Ottawa)
const USER_LOCATION: [number, number] = [45.4215, -75.6972];

// Mock data with coordinates (roughly around Ottawa)
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Indie Night at The Basement",
    category: "Live Music",
    date: "This Friday",
    time: "8:00 PM - 11:00 PM",
    location: "The Basement, 2 km away",
    coords: [45.4115, -75.6972] as [number, number],
    price: "$15",
    image: eventMusic,
    source: "Facebook Events",
    description: "Catch three amazing local indie bands in an intimate setting. Drink specials all night."
  },
  {
    id: 2,
    title: "Couples Pottery Workshop",
    category: "Workshop",
    date: "Saturday",
    time: "2:00 PM - 4:00 PM",
    location: "Clay & Co Studio, 5 km away",
    coords: [45.4515, -75.6672] as [number, number],
    price: "$65",
    image: eventPottery,
    source: "Eventbrite",
    description: "Learn the basics of wheel throwing together. Price includes materials and firing for two pieces."
  },
  {
    id: 3,
    title: "Classic Car Show & Shine",
    category: "Car Shows",
    date: "Saturday",
    time: "10:00 AM - 3:00 PM",
    location: "Centennial Park, 8 km away",
    coords: [45.3815, -75.7572] as [number, number],
    price: "Free Entry",
    image: eventCarshow,
    source: "Facebook Events",
    description: "Stroll through rows of beautifully restored vintage and classic cars. Food vendors on site."
  },
  {
    id: 4,
    title: "Underground Comedy Night",
    category: "Comedy Shows",
    date: "This Friday",
    time: "9:00 PM - 11:00 PM",
    location: "The Laugh Lounge, 3 km away",
    coords: [45.4315, -75.7272] as [number, number],
    price: "$20",
    image: eventComedy,
    source: "Local Listing",
    description: "Four hilariou local comedians and one touring headliner. Two drink minimum."
  },
  {
    id: 5,
    title: "Weekend Farmers Market",
    category: "Markets",
    date: "Sunday",
    time: "8:00 AM - 1:00 PM",
    location: "Downtown Square, 4 km away",
    coords: [45.4015, -75.6572] as [number, number],
    price: "Free Entry",
    image: eventMarket,
    source: "Local Listing",
    description: "Fresh local produce, artisanal baked goods, and handmade crafts. Great morning stroll."
  },
  {
    id: 6,
    title: "Twilight Food Truck Fest",
    category: "Food",
    date: "Sunday",
    time: "5:00 PM - 9:00 PM",
    location: "Riverfront Park, 6.5 km away",
    coords: [45.4415, -75.7472] as [number, number],
    price: "Free Entry",
    image: eventFood,
    source: "Local Listing",
    description: "Over 20 food trucks, craft beer garden, and lawn games by the river."
  }
];

// Component to dynamically fit map bounds to both points
function MapBoundsFitter({ userCoords, eventCoords }: { userCoords: [number, number], eventCoords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([userCoords, eventCoords]);
    // Add some padding so markers aren't right on the edge
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [userCoords, eventCoords, map]);
  return null;
}

export default function Events() {
  const [, setLocation] = useLocation();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentEvent = events[0];

  const handleSwipe = (dir: "left" | "right") => {
    setDirection(dir);
    setShowDetails(false);
    setShowMap(false);
    
    // In a real app, 'right' would save a like to DB.
    // If both partners liked, trigger a match.
    // For prototype, if they like Pottery (id 2), we'll trigger a match.
    setTimeout(() => {
      if (dir === "right" && currentEvent?.id === 2) {
        setLocation("/match");
      } else {
        setEvents((prev) => prev.slice(1));
        setDirection(null);
      }
    }, 300); // Wait for animation
  };

  if (!currentEvent) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-primary opacity-50" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You're all caught up!</h2>
        <p className="text-muted-foreground mb-8">We're looking for more events that match your vibe.</p>
        <Button onClick={() => setEvents(MOCK_EVENTS)} variant="outline" className="rounded-xl h-12 px-6">
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-6 pt-12">
        <div className="flex -space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-200 overflow-hidden">
            <img src="https://i.pravatar.cc/100?img=32" alt="You" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-200 overflow-hidden relative">
            <img src="https://i.pravatar.cc/100?img=44" alt="Partner" className="opacity-50 grayscale" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
              <span className="text-[10px] font-bold text-white leading-none">WAITING</span>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 px-4 py-2 rounded-full flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">25 km</span>
        </div>
      </header>

      {/* Swipe Area */}
      <div className="flex-1 relative flex flex-col justify-center px-4 pb-32">
        <AnimatePresence>
          <motion.div
            key={currentEvent.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: direction === "left" ? -200 : direction === "right" ? 200 : 0,
              rotate: direction === "left" ? -10 : direction === "right" ? 10 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={(e, { offset }) => {
              if (offset.x > 100) {
                handleSwipe("right");
              } else if (offset.x < -100) {
                handleSwipe("left");
              }
            }}
            whileDrag={{ cursor: "grabbing" }}
            className="absolute inset-x-4 top-4 bottom-32 bg-card rounded-[2rem] shadow-xl overflow-hidden border border-border touch-none"
          >
            {/* Image */}
            <div 
              className="absolute inset-x-0 top-0 h-3/5 cursor-pointer focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-inset focus-visible:outline-none"
              onClick={() => setShowDetails(!showDetails)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowDetails(!showDetails);
                }
              }}
              aria-expanded={showDetails}
              aria-label={`Toggle details for ${currentEvent.title}`}
            >
              <img 
                src={currentEvent.image} 
                alt={currentEvent.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
              
              <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
                <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  {currentEvent.category}
                </span>
                <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {currentEvent.price}
                </span>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div 
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    className="absolute inset-0 bg-black/70 flex items-center justify-center p-8 text-center z-20"
                  >
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      className="text-white text-lg font-medium leading-relaxed"
                    >
                      {currentEvent.description}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-card p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-1 leading-tight">{currentEvent.title}</h2>
              <div className="flex items-center text-muted-foreground text-sm mb-4 gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{currentEvent.date}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentEvent.time}</span>
                </div>
              </div>

              <div 
                className="flex items-start gap-2 mb-4 cursor-pointer hover:bg-secondary/20 p-1 -ml-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none" 
                onClick={() => setShowMap(!showMap)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowMap(!showMap);
                  }
                }}
                aria-expanded={showMap}
                aria-label={`View ${currentEvent.location} on map`}
              >
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">{currentEvent.location}</p>
                  <p className="text-xs text-primary mt-0.5 font-semibold">Tap to view on map</p>
                </div>
              </div>

              <AnimatePresence>
                {showMap && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 160, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full mb-4 rounded-xl overflow-hidden border border-border shrink-0"
                  >
                    <MapContainer 
                      center={USER_LOCATION} 
                      zoom={12} 
                      scrollWheelZoom={false}
                      className="w-full h-full"
                      attributionControl={false}
                      zoomControl={false}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      <MapBoundsFitter userCoords={USER_LOCATION} eventCoords={currentEvent.coords} />
                      <Marker position={USER_LOCATION} icon={userIcon} />
                      <Marker position={currentEvent.coords} />
                    </MapContainer>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto flex justify-between items-center text-xs text-muted-foreground cursor-pointer" onClick={() => {setShowDetails(!showDetails); setShowMap(false);}}>
                <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Tap image for details</span>
                <span>Source: {currentEvent.source}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 inset-x-0 p-8 pt-0 flex justify-center items-end gap-6 bg-gradient-to-t from-background via-background/90 to-transparent h-40">
        <button 
          className="w-14 h-14 bg-card rounded-full shadow-lg border border-border flex items-center justify-center text-muted-foreground hover:scale-105 transition-transform cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          onClick={() => {
            setEvents(MOCK_EVENTS);
            setDirection(null);
            setShowDetails(false);
            setShowMap(false);
          }}
          aria-label="Undo swipe and start over"
        >
          <Undo2 className="w-6 h-6" aria-hidden="true" />
        </button>

        <button 
          className="w-20 h-20 bg-card rounded-full shadow-xl border border-border flex items-center justify-center text-foreground hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          onClick={() => handleSwipe("left")}
          aria-label="Pass on this event"
        >
          <X className="w-10 h-10" aria-hidden="true" />
        </button>

        <button 
          className="w-20 h-20 bg-primary rounded-full shadow-xl shadow-primary/30 flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"
          onClick={() => handleSwipe("right")}
          aria-label="Like this event"
        >
          <Heart className="w-10 h-10 fill-current" aria-hidden="true" />
        </button>

        <button 
          className="w-14 h-14 bg-card rounded-full shadow-lg border border-border flex items-center justify-center text-muted-foreground hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Share this event"
        >
          <Share2 className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
