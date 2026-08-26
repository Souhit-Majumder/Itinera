"use client";

import { useState } from "react";
import { useTrip } from "@/components/providers/TripProvider";
import { getAIContextualResponse } from "@/lib/demo/seed";
import { X, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

export function AIGuide() {
  const [open, setOpen] = useState(false);
  const { trip } = useTrip();

  // Determine state for contextual response
  const currentDest = trip.destinations.find(d => d.state === 'current');
  let contextState: 'initial' | 'bengaluru-progress' | 'goa-unlocked' = 'initial';
  
  if (currentDest?.id === 'dest-bengaluru') {
    const isCompleted = currentDest.quest.objectives.every(o => o.completed);
    if (!isCompleted) {
      contextState = 'bengaluru-progress';
    } else {
      contextState = 'goa-unlocked';
    }
  }

  const initialMessage = getAIContextualResponse(contextState);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-white text-quest p-3 rounded-2xl shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-colors md:bottom-6"
        aria-label="AI Guide"
      >
        <Sparkles size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white w-full h-[70vh] sm:h-auto sm:max-h-[80vh] sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                <h3 className="font-outfit font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles size={18} className="text-quest" /> 
                  <Logo className="h-5 w-auto" /> Guide
                </h3>
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-quest flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-700 max-w-[85%]">
                    {initialMessage}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <button className="bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600 hover:border-quest transition-colors">
                    What&apos;s nearby?
                  </button>
                  <button className="bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600 hover:border-quest transition-colors">
                    Transport options
                  </button>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <input 
                    type="text" 
                    placeholder="Ask anything..." 
                    className="flex-1 bg-transparent outline-none text-sm px-2 text-slate-800 placeholder:text-slate-400"
                    disabled
                  />
                  <button className="bg-quest text-white p-1.5 rounded-lg opacity-50 cursor-not-allowed">
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2">Demo mode: Responses are deterministic.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
