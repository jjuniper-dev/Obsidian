import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarHeart, MapPin, Users, Sparkles, SlidersHorizontal } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center text-center space-y-8"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
          <div className="bg-primary text-primary-foreground p-5 rounded-3xl relative shadow-xl">
            <CalendarHeart className="w-12 h-12" />
          </div>
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 bg-accent text-accent-foreground p-1.5 rounded-full shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            WeGo
          </h1>
          <p className="text-lg text-muted-foreground">
            Stop asking "what do you want to do?" Swipe on local events and find your perfect mutual match.
          </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            onClick={() => setLocation("/onboarding")}
            aria-label="Get Started"
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-14 text-lg rounded-2xl border-2 hover:bg-secondary/50"
            onClick={() => setLocation("/events")}
            aria-label="Log in to existing account"
          >
            I already have an account
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full pt-8 border-t border-border">
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-secondary/50 p-3 rounded-2xl">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Connect</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-secondary/50 p-3 rounded-2xl">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Filter</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-secondary/50 p-3 rounded-2xl">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Match</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
