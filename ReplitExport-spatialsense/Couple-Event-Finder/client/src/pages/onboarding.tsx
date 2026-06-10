import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, MapPin, Calendar, CreditCard, Tag } from "lucide-react";
import { MapContainer, TileLayer, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Ottawa coordinates
const OTTAWA_LAT = 45.4215;
const OTTAWA_LNG = -75.6972;

// Component to dynamically update map center and zoom based on radius
function MapUpdater({ radius }: { radius: number }) {
  const map = useMap();
  useEffect(() => {
    // Rough calculation: 1 zoom level decrease roughly doubles the visible area
    // At zoom 11, we see roughly 15-20km radius well
    const zoom = Math.max(9, 13 - Math.log2(radius / 10));
    map.setZoom(zoom);
  }, [radius, map]);
  return null;
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [radius, setRadius] = useState([25]);
  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else setLocation("/events");
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else setLocation("/");
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Progress Header */}
      <div className="pt-12 pb-4 px-6 flex items-center justify-between">
        <button onClick={prevStep} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 === step ? "w-6 bg-primary" : 
                i + 1 < step ? "w-2 bg-primary/50" : "w-2 bg-secondary"
              }`} 
            />
          ))}
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pt-4"
            >
              <div className="space-y-3">
                <div className="bg-secondary/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Set your scene.</h2>
                <p className="text-muted-foreground text-lg">Discover what's out there.</p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <Label className="text-base" htmlFor="location-input">City or Postal Code</Label>
                  <Input 
                    id="location-input"
                    placeholder="e.g. Ottawa, ON" 
                    className="h-14 text-lg rounded-xl bg-secondary/20 border-border/50 focus-visible:ring-primary"
                    defaultValue="Ottawa, ON"
                    aria-label="City or Postal Code"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-base" htmlFor="radius-slider">Search Radius</Label>
                    <span className="font-semibold text-primary" aria-live="polite">{radius[0]} km</span>
                  </div>
                  <Slider 
                    id="radius-slider"
                    value={radius} 
                    onValueChange={setRadius} 
                    max={100} 
                    step={5} 
                    className="py-2"
                    aria-label="Search Radius in kilometers"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>100+ km</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pt-4"
            >
              <div className="space-y-3">
                <div className="bg-secondary/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">When are you free?</h2>
                <p className="text-muted-foreground text-lg">Connect your calendar or manually select your usual date nights.</p>
              </div>

              <div className="space-y-4 pt-4">
                <Button variant="outline" className="w-full h-16 justify-between px-6 rounded-2xl border-2 hover:bg-secondary/50 group" aria-label="Connect Google Calendar">
                  <div className="flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="" className="w-6 h-6" aria-hidden="true" />
                    <span className="text-lg font-medium">Connect Google Calendar</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                </Button>
                
                <Button variant="outline" className="w-full h-16 justify-between px-6 rounded-2xl border-2 hover:bg-secondary/50 group" aria-label="Connect Apple Calendar">
                  <div className="flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Apple_Calendar_icon.svg" alt="" className="w-6 h-6" aria-hidden="true" />
                    <span className="text-lg font-medium">Connect Apple Calendar</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">Or set manual days</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Thu Night', 'Fri Night', 'Sat Day', 'Sat Night', 'Sun Day'].map((time) => (
                    <button 
                      key={time}
                      className="px-4 py-3 rounded-xl border-2 border-border/50 font-medium hover:border-primary/50 focus:bg-primary/10 focus:border-primary focus:text-primary transition-all"
                      aria-pressed="false"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pt-4"
            >
              <div className="space-y-3">
                <div className="bg-secondary/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">What's the budget?</h2>
                <p className="text-muted-foreground text-lg">We'll filter out events that break the bank.</p>
              </div>

              <div className="space-y-8 pt-4">
                <div className="grid grid-cols-4 gap-3">
                  {['Free', '$', '$$', '$$$'].map((tier, i) => (
                    <button 
                      key={tier}
                      className={`h-16 rounded-2xl border-2 flex items-center justify-center text-lg font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
                        ${i === 1 ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 hover:bg-secondary/30'}
                      `}
                      aria-pressed={i === 1}
                      aria-label={`Budget tier: ${tier}`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-4 pt-6 border-t border-border">
                  <h3 className="font-semibold text-lg">Dealbreakers</h3>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                    <div>
                      <Label htmlFor="age-switch" className="font-medium text-base">21+ Only</Label>
                      <p className="text-sm text-muted-foreground" id="age-desc">Hide events allowing minors</p>
                    </div>
                    <Switch id="age-switch" aria-describedby="age-desc" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                    <div>
                      <Label htmlFor="outdoor-switch" className="font-medium text-base">Outdoor Only</Label>
                      <p className="text-sm text-muted-foreground" id="outdoor-desc">Prefer open-air events</p>
                    </div>
                    <Switch id="outdoor-switch" aria-describedby="outdoor-desc" />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                    <div>
                      <Label htmlFor="dog-switch" className="font-medium text-base">Dog Friendly</Label>
                      <p className="text-sm text-muted-foreground" id="dog-desc">Show only dog friendly events</p>
                    </div>
                    <Switch id="dog-switch" aria-describedby="dog-desc" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pt-4"
            >
              <div className="space-y-3">
                <div className="bg-secondary/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Tag className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">What do you like?</h2>
                <p className="text-muted-foreground text-lg">Select a few categories to get better event recommendations.</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {[
                  'Live Music 🎸', 'Food Festivals 🌮', 'Comedy Shows 😂', 
                  'Art Galleries 🎨', 'Workshops ✂️', 'Markets 🛍️',
                  'Theater 🎭', 'Outdoor Adventure 🌲', 'Pop-ups ✨', 'Car Shows 🚗'
                ].map((category, i) => (
                  <button 
                    key={category}
                    className={`px-5 py-3 rounded-full border-2 font-medium transition-all text-base border-border/60 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`}
                    aria-pressed="false"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20"
          onClick={nextStep}
        >
          {step === totalSteps ? "Start Swiping" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
