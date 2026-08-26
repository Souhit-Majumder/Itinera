"use client";

import { useTrip } from "@/components/providers/TripProvider";


export function JourneyHUD() {
  const { trip } = useTrip();
  
  const completedCount = trip.destinations.filter(d => d.state === 'completed').length;
  const totalDestinations = trip.destinations.length;
  const progress = Math.round((completedCount / totalDestinations) * 100);

  return (
    <div className="flex justify-between items-start pointer-events-auto">
      {/* Trip Overview */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div>
          <h2 className="font-outfit font-bold text-slate-800 text-sm">Itinera Journey</h2>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
            <span>{trip.destinations[0].name}</span>
            <span className="text-slate-300">→</span>
            <span>{trip.destinations[trip.destinations.length - 1].name}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-quest bg-indigo-50 text-quest font-bold text-xs">
          {progress}%
        </div>
      </div>
    </div>
  );
}
