"use client";

import { useTrip } from "@/components/providers/TripProvider";
import { demoTrip, demoFlightTrip } from "@/lib/demo/seed";

export function JourneyHUD() {
  const { trip, switchTrip } = useTrip();
  
  const completedCount = trip.destinations.filter(d => d.state === 'completed').length;
  const totalDestinations = trip.destinations.length;
  const progress = Math.round((completedCount / totalDestinations) * 100);

  return (
    <div className="flex justify-between items-start pointer-events-auto">
      {/* Trip Overview */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <select 
              value={trip.id}
              onChange={(e) => {
                if (e.target.value === 'trip-1') switchTrip(demoTrip);
                else if (e.target.value === 'trip-2') switchTrip(demoFlightTrip);
              }}
              className="bg-transparent font-outfit font-bold text-slate-800 text-sm focus:outline-none cursor-pointer border-b border-slate-200 pb-1"
            >
              <option value="trip-1">{demoTrip.name}</option>
              <option value="trip-2">{demoFlightTrip.name}</option>
            </select>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
              <span>{trip.destinations[0].name}</span>
              <span className="text-slate-300">→</span>
              <span>{trip.destinations[trip.destinations.length - 1].name}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-quest bg-indigo-50 text-quest font-bold text-xs shrink-0">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}
