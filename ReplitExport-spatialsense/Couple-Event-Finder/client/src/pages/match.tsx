import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CalendarHeart, Heart, Check, Clock, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import eventPottery from "@/assets/images/event-pottery.png";
import confetti from "canvas-confetti";

export default function Match() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff758f', '#ff8fa3', '#c9184a']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[50%] bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] bg-secondary/40 blur-[100px] rounded-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center -space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-background bg-zinc-200 overflow-hidden z-10">
              <img src="https://i.pravatar.cc/100?img=32" alt="Your profile picture" />
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-background bg-zinc-200 overflow-hidden z-0">
              <img src="https://i.pravatar.cc/100?img=44" alt="Partner's profile picture" />
            </div>
            <div className="absolute -mt-3 ml-12 bg-primary text-white p-2 rounded-full shadow-lg z-20" aria-hidden="true">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold text-primary mb-2">It's a Match!</h1>
          <p className="text-lg text-muted-foreground">You both want to go to</p>
        </motion.div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm bg-card rounded-3xl overflow-hidden shadow-2xl border border-border mb-8"
        >
          <div className="h-48 relative">
            <img src={eventPottery} alt="Couples Pottery Workshop" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="bg-primary/90 text-white text-xs font-bold px-2.5 py-1 rounded-md mb-2 inline-block">
                Workshop
              </span>
              <h2 className="text-xl font-bold text-white leading-tight">Couples Pottery Workshop</h2>
            </div>
          </div>
          
          <div className="p-5 bg-card">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center shrink-0" aria-hidden="true">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Saturday, Oct 14</p>
                  <p className="text-muted-foreground">2:00 PM - 4:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center shrink-0" aria-hidden="true">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Clay & Co Studio</p>
                  <p className="text-muted-foreground">124 Main St (5 km away)</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm space-y-3"
        >
          <Button 
            className="w-full h-14 rounded-2xl text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2"
          >
            <CalendarHeart className="w-5 h-5" />
            Add to our Calendars
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-14 rounded-2xl text-base border-2 font-medium"
            onClick={() => setLocation("/events")}
          >
            Keep Swiping
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
