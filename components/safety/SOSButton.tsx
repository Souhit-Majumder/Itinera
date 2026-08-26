"use client";

import { useState } from "react";
import { useTrip } from "@/components/providers/TripProvider";
import { Phone, AlertCircle, ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SOSButton() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 bg-white text-danger p-3 rounded-2xl shadow-sm border border-red-100 hover:bg-red-50 transition-colors"
        aria-label="SOS Emergency"
      >
        <ShieldAlert size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-danger text-white p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-outfit font-bold text-lg flex items-center gap-2">
                    <AlertCircle size={20} /> Emergency Assistance
                  </h3>
                  <p className="text-red-100 text-xs mt-1">DEMO / MOCK FUNCTIONALITY</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-red-100 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-slate-600 mb-4">
                  Below are seeded nearby responders. This is a demo; real emergency services are <strong>never</strong> contacted.
                </p>
                <SOSRespondersList />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function SOSRespondersList() {
  const { responders } = useTrip();

  return (
    <div className="space-y-3">
      {responders.map(r => (
        <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
          <div>
            <div className="font-medium text-slate-800 text-sm">{r.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{r.type} • {r.distance}</div>
          </div>
          <button className="bg-danger text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm" aria-label={`Call ${r.name}`}>
            <Phone size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
