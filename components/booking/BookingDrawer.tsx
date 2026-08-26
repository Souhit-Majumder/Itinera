"use client";

import { useTrip } from "@/components/providers/TripProvider";
import { motion } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import QRCode from "react-qr-code";
import { TransportIcon } from "@/components/ui/TransportIcon";

export function BookingDrawer() {
  const { trip, selectedLegId, setSelectedLegId, bookLeg } = useTrip();

  const leg = trip.legs.find(l => l.id === selectedLegId);
  if (!leg) return null;

  const from = trip.destinations.find(d => d.id === leg.fromDestinationId);
  const to = trip.destinations.find(d => d.id === leg.toDestinationId);
  
  if (!from || !to) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="bg-white w-full h-[85vh] sm:h-auto sm:max-h-[90vh] sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
          <h3 className="font-outfit font-bold text-slate-800 text-lg">Transport Options</h3>
          <button onClick={() => setSelectedLegId(null)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full border border-slate-200 shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-2xl font-outfit font-bold text-slate-800">{from.name}</div>
              <div className="text-sm text-slate-500 font-medium">{leg.departureTime}</div>
            </div>
            <div className="flex flex-col items-center px-4 text-slate-300">
              <TransportIcon mode={leg.mode} size={24} className="text-quest mb-1" />
              <ArrowRight size={20} />
            </div>
            <div className="text-center">
              <div className="text-2xl font-outfit font-bold text-slate-800">{to.name}</div>
              <div className="text-sm text-slate-500 font-medium">{leg.arrivalTime}</div>
            </div>
          </div>

          {!leg.booked ? (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm hover:border-quest transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 text-quest p-3 rounded-xl">
                    <TransportIcon mode={leg.mode} size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 capitalize">{leg.mode} Journey</div>
                    <div className="text-xs text-slate-500">View Route Details</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-slate-800">{leg.fare}</div>
                </div>
              </div>
              <button 
                onClick={() => bookLeg(leg.id)}
                className="w-full bg-quest text-white font-medium py-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
              >
                Confirm Mock Booking
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <CheckCircle2 size={48} className="text-success mb-2" />
              <div className="font-outfit font-bold text-xl text-slate-800 mb-1">Booking Confirmed</div>
              <p className="text-sm text-slate-500 text-center mb-6">Your demo transport has been booked successfully.</p>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <QRCode value={leg.ticketPayload || "DEMO-TICKET"} size={160} fgColor="#0f172a" />
              </div>
              <div className="text-xs font-mono text-slate-400 mt-4 tracking-wider">
                {leg.ticketPayload}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                This is a demo ticket. The QR code contains mock data.
              </p>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
