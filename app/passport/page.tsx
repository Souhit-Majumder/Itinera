"use client";

import { useTrip } from "@/components/providers/TripProvider";
import { Book, Award } from "lucide-react";
import { TransportIcon } from "@/components/ui/TransportIcon";
import { motion } from "framer-motion";

export default function PassportPage() {
  const { getPassportStamps } = useTrip();
  const stamps = getPassportStamps();

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto p-6 md:p-10 pb-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4 border border-slate-100">
            <Book className="text-quest w-8 h-8" />
          </div>
          <h1 className="font-outfit font-bold text-3xl text-slate-800">Your Travel Passport</h1>
          <p className="text-slate-500 mt-2">A collection of your completed destinations.</p>
        </header>

        {stamps.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-slate-100 shadow-sm">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-outfit font-bold text-lg text-slate-700">No stamps yet</h3>
            <p className="text-slate-500 text-sm mt-2">Complete your first destination quest to earn a passport stamp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stamps.map((stamp, idx) => (
              <motion.div 
                key={stamp.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-center aspect-square flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent pointer-events-none" />
                
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-success flex items-center justify-center mb-3">
                  <TransportIcon mode="walking" size={24} />
                </div>
                <h3 className="font-outfit font-bold text-slate-800">{stamp.name}</h3>
                <p className="text-[10px] uppercase font-bold text-emerald-600 mt-2 tracking-widest">
                  COMPLETED
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
