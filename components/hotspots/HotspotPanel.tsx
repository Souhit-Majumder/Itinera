"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Plus, Minus, Filter, Clock, MapPin } from "lucide-react";
import clsx from "clsx";
import { useHotspots } from "@/lib/places/useHotspots";
import { useTrip } from "@/components/providers/TripProvider";
import { HotspotCategory, BudgetLevel, TransportMode } from "@/types";

export function HotspotPanel({
  selectedHotspot,
  onHotspotSelect,
}: {
  selectedHotspot: Hotspot | null;
  onHotspotSelect: (hotspot: Hotspot | null) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [category, setCategory] = useState<HotspotCategory | 'all'>('all');
  const [budget, setBudget] = useState<BudgetLevel | null>(null);
  const [transport, setTransport] = useState<TransportMode | null>(null);

  const { trip, addHotspotToJourney, removeHotspotFromJourney } = useTrip();

  // Find the active destination
  const currentDest = trip.destinations.find(d => d.state === 'current') || trip.destinations[0];
  
  const { hotspots, loading, error } = useHotspots(
    currentDest ? currentDest.coordinates : null,
    category,
    budget,
    transport
  );

  if (!currentDest) return null;

  const categories: { id: HotspotCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'attraction', label: 'See', icon: '🏛️' },
    { id: 'restaurant', label: 'Eat', icon: '🍽️' },
    { id: 'park', label: 'Park', icon: '🌿' },
    { id: 'shopping', label: 'Shop', icon: '🛍️' },
    { id: 'nightlife', label: 'Night', icon: '🍸' },
  ];

  const transports: { id: TransportMode; label: string; icon: string }[] = [
    { id: 'walking', label: 'Walk (<2km)', icon: '🚶' },
    { id: 'bicycle', label: 'Bike (<5km)', icon: '🚲' },
    { id: 'car', label: 'Car/Taxi', icon: '🚕' },
  ];

  return (
    <div
      className={clsx(
        "absolute top-0 right-0 h-full z-20 flex flex-row",
        "pointer-events-none"
      )}
    >
      {/* ── Collapse / Expand toggle ── */}
      <div className="pointer-events-auto flex flex-col items-center justify-center mr-0 self-start mt-24">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={clsx(
            "w-5 h-10 flex items-center justify-center",
            "bg-white/90 backdrop-blur-xl",
            "border border-white/70 border-r-0 rounded-l-lg",
            "shadow-[-2px_0_8px_rgba(0,0,0,0.08)]",
            "hover:bg-slate-50/90 transition-colors text-slate-400"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </div>

      {/* ── Sidebar panel ── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.aside
            key="hotspot-sidebar"
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={clsx(
              "pointer-events-auto",
              "w-[320px] md:w-[360px] h-full flex flex-col overflow-hidden",
              "bg-white/90 backdrop-blur-xl",
              "border-l border-white/70",
              "shadow-[-4px_0_32px_rgba(0,0,0,0.08)]"
            )}
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-3 shrink-0 border-b border-slate-200/60 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-amber-500 shrink-0" />
                <h3 className="text-sm font-bold text-slate-800 truncate">
                  Explore {currentDest.name}
                </h3>
              </div>
              
              {/* Categories */}
              <div className="flex overflow-x-auto gap-1.5 pb-2 scrollbar-hide">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={clsx(
                      "px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors border",
                      category === c.id 
                        ? "bg-amber-100/80 border-amber-200 text-amber-800" 
                        : "bg-white/50 border-slate-200/60 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <span className="mr-1">{c.icon}</span>{c.label}
                  </button>
                ))}
              </div>

              {/* Transport & Budget filters */}
              <div className="flex items-center gap-2 mt-1">
                <Filter size={10} className="text-slate-400 shrink-0" />
                <div className="flex flex-1 overflow-x-auto gap-1.5 pb-1 scrollbar-hide">
                  {/* Budget */}
                  <button
                    onClick={() => setBudget(b => b === null ? 1 : b < 4 ? (b + 1) as BudgetLevel : null)}
                    className={clsx(
                      "px-2 py-0.5 rounded text-[10px] font-medium border transition-colors shrink-0",
                      budget !== null ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white/50 border-slate-200/60 text-slate-500"
                    )}
                  >
                    {budget === null ? 'Any $' : '$'.repeat(budget)}
                  </button>
                  {/* Transport */}
                  {transports.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTransport(transport === t.id ? null : t.id)}
                      className={clsx(
                        "px-2 py-0.5 rounded text-[10px] font-medium border transition-colors shrink-0 flex items-center gap-1",
                        transport === t.id ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white/50 border-slate-200/60 text-slate-500"
                      )}
                    >
                       <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-slate-50/30">
              {loading ? (
                <div className="text-[11px] text-slate-400 text-center py-4 animate-pulse">
                  Finding best spots...
                </div>
              ) : error ? (
                <div className="text-[11px] text-rose-500 text-center py-4">
                  {error}
                </div>
              ) : hotspots.length === 0 ? (
                <div className="text-[11px] text-slate-400 text-center py-4">
                  No places found matching criteria.
                </div>
              ) : (
                hotspots.map((h) => {
                  const isAdded = currentDest.checkpoints.some(c => c.hotspotId === h.id);
                  const isSelected = selectedHotspot?.id === h.id;

                  return (
                    <div
                      key={h.id}
                      onClick={() => onHotspotSelect(isSelected ? null : h)}
                      className={clsx(
                        "rounded-xl p-2.5 transition-all cursor-pointer",
                        "bg-white/60 backdrop-blur-sm border border-white/80",
                        isSelected ? "shadow-[0_2px_12px_rgba(245,158,11,0.15)] border-amber-200 ring-1 ring-amber-100" : "shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md",
                        isAdded && !isSelected && "bg-indigo-50/40 border-indigo-100/60"
                      )}
                    >
                      <div className="flex gap-2.5">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200/50">
                           {h.photoUrl ? (
                             <img src={h.photoUrl} alt={h.name} className="w-full h-full object-cover" />
                           ) : (
                             <span className="text-3xl opacity-50">
                               {h.category === 'restaurant' ? '🍽️' : h.category === 'park' ? '🌿' : '📍'}
                             </span>
                           )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[12px] font-bold text-slate-800 truncate leading-tight">
                            {h.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                            {h.rating && (
                              <span className="flex items-center text-amber-500 font-medium">
                                <Star size={9} className="fill-amber-500 mr-0.5" />
                                {h.rating}
                              </span>
                            )}
                            {h.budgetLevel && (
                              <span>{'$'.repeat(h.budgetLevel)}</span>
                            )}
                            <span className="capitalize">{h.category}</span>
                          </div>
                          
                          {/* Distance & Open Now */}
                          <div className="flex items-center gap-1.5 mt-1 text-[9px]">
                            {h.openNow !== undefined && (
                              <span className={clsx("flex items-center gap-0.5 font-medium", h.openNow ? "text-emerald-600" : "text-rose-500")}>
                                <Clock size={8} /> {h.openNow ? 'Open' : 'Closed'}
                              </span>
                            )}
                            {h.distanceKm !== undefined && (
                              <span className="text-slate-400">{h.distanceKm} km away</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Add/Remove Action */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAdded) {
                              removeHotspotFromJourney(currentDest.id, h.id);
                            } else {
                              addHotspotToJourney(currentDest.id, h);
                            }
                          }}
                          className={clsx(
                            "px-2.5 py-1 rounded flex items-center gap-1 text-[10px] font-semibold transition-colors",
                            isAdded 
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
                              : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm"
                          )}
                        >
                          {isAdded ? (
                            <><Minus size={10} /> Remove</>
                          ) : (
                            <><Plus size={10} /> Add to Journey</>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
