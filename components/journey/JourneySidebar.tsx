"use client";

import { useState } from "react";
import { useTrip } from "@/components/providers/TripProvider";
import { demoTrip, demoFlightTrip } from "@/lib/demo/seed";
import { TransportIcon } from "@/components/ui/TransportIcon";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Lock,
  CheckCircle,
  Circle,
  ArrowRight,
  Check,
  ChevronUp,
  ChevronDown,
  Car,
  Footprints
} from "lucide-react";
import clsx from "clsx";
import { Destination, TransportLeg } from "@/types";

// ── Helper sub-components ────────────────────────────────────────────────────

function StateIcon({ state }: { state: Destination["state"] }) {
  if (state === "completed")
    return <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />;
  if (state === "current")
    return (
      <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      </span>
    );
  return <Lock size={13} className="text-slate-300 shrink-0" />;
}

/** Transport leg pill shown between destination cards */
function LegConnector({ leg }: { leg: TransportLeg }) {
  return (
    <div className="flex items-start gap-2 my-0.5 pl-[18px]">
      {/* Vertical track line */}
      <div className="flex flex-col items-center w-4 shrink-0 gap-0 pt-1">
        <div className="w-px flex-1 bg-slate-200/80" style={{ minHeight: 8 }} />
      </div>
      {/* Leg badge */}
      <div
        className={clsx(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] w-full",
          "bg-white/70 backdrop-blur-sm border border-slate-200/60",
          "shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
        )}
      >
        <TransportIcon mode={leg.mode} size={12} className="text-indigo-500 shrink-0" />
        <span className="font-semibold text-slate-700 truncate">{leg.provider}</span>
        <span className="text-slate-400 shrink-0">
          {leg.departureTime}–{leg.arrivalTime}
        </span>
        <span className="text-slate-500 font-medium shrink-0">{leg.fare}</span>
        {leg.booked && (
          <span className="ml-auto font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded-full shrink-0">
            BOOKED
          </span>
        )}
      </div>
    </div>
  );
}

/** Inline quest objectives + progress for the current destination */
function InlineQuest({
  destination,
  completeObjective,
  onAdvance,
  nextDestName,
  focusedCheckpointId,
  setFocusedCheckpointId,
  setArrivalMode,
  reorderCheckpoints,
}: {
  destination: Destination;
  completeObjective: (destId: string, objId: string) => void;
  onAdvance?: () => void;
  nextDestName?: string;
  focusedCheckpointId: string | null;
  setFocusedCheckpointId: (id: string | null) => void;
  setArrivalMode: (destinationId: string, mode: 'walking' | 'car') => void;
  reorderCheckpoints: (destinationId: string, fromIndex: number, toIndex: number) => void;
}) {
  const { objectives } = destination.quest;
  const completedCount = objectives.filter((o) => o.completed).length;
  const allDone = completedCount === objectives.length;
  const progress = Math.round((completedCount / objectives.length) * 100);

  return (
    <div
      className={clsx(
        "mt-2 rounded-xl overflow-hidden",
        "bg-white/60 backdrop-blur-md",
        "border border-white/80 shadow-[0_2px_12px_rgba(99,102,241,0.07)]"
      )}
    >
      {/* Mini progress bar */}
      <div className="h-0.5 bg-slate-100">
        <motion.div
          className="h-full bg-indigo-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {destination.quest.title} · {completedCount}/{objectives.length}
          </p>
          <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-md">
            <button
              onClick={() => setArrivalMode(destination.id, 'walking')}
              className={clsx(
                "p-1 rounded text-[10px] font-medium flex items-center gap-1 transition-all",
                destination.arrivalMode === 'walking' 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="Walk to first place"
            >
              <Footprints size={10} /> Walk
            </button>
            <button
              onClick={() => setArrivalMode(destination.id, 'car')}
              className={clsx(
                "p-1 rounded text-[10px] font-medium flex items-center gap-1 transition-all",
                destination.arrivalMode === 'car' 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="Drive to first place"
            >
              <Car size={10} /> Drive
            </button>
          </div>
        </div>

        {/* Objectives */}
        {objectives.map((obj, idx) => {
          const checkpointId = destination.checkpoints[idx]?.id;
          const isFocused = focusedCheckpointId === checkpointId;

          return (
            <div
              key={obj.id}
              onClick={() => {
                if (checkpointId) setFocusedCheckpointId(checkpointId);
              }}
              className={clsx(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-[11px]",
                obj.completed
                  ? (isFocused ? "bg-slate-100/90 border border-slate-300 shadow-sm opacity-80" : "bg-slate-50/80 border border-transparent opacity-60")
                  : (isFocused 
                      ? "bg-indigo-50 border border-indigo-400 shadow-[0_2px_8px_rgba(99,102,241,0.2)]" 
                      : "bg-white/80 border border-slate-200/70 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50")
              )}
            >
              <div 
                className={clsx(
                  "shrink-0", 
                  !obj.completed && "cursor-pointer hover:scale-110 transition-transform",
                  obj.completed ? "text-emerald-500" : "text-slate-300 hover:text-indigo-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!obj.completed) completeObjective(destination.id, obj.id);
                }}
              >
                <AnimatePresence mode="wait">
                  {obj.completed ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <CheckCircle size={14} className="fill-emerald-50" />
                    </motion.div>
                  ) : (
                    <motion.div key="circle">
                      <Circle size={14} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className={clsx("font-medium cursor-pointer flex-1", obj.completed && "line-through text-slate-400")}>
                {obj.title}
              </span>
              
              {!obj.completed && (
                <div className="flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="text-slate-400 hover:text-indigo-500 disabled:opacity-30 disabled:hover:text-slate-400"
                    disabled={idx === 0}
                    onClick={(e) => { e.stopPropagation(); reorderCheckpoints(destination.id, idx, idx - 1); }}
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button 
                    className="text-slate-400 hover:text-indigo-500 disabled:opacity-30 disabled:hover:text-slate-400"
                    disabled={idx === objectives.length - 1}
                    onClick={(e) => { e.stopPropagation(); reorderCheckpoints(destination.id, idx, idx + 1); }}
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Advance / Completed callout */}
        <AnimatePresence>
          {allDone && onAdvance && (
            <motion.button
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onClick={onAdvance}
              className={clsx(
                "w-full mt-1 flex items-center justify-center gap-1.5",
                "px-3 py-2 rounded-lg text-[11px] font-semibold",
                "bg-indigo-500 hover:bg-indigo-600 text-white",
                "shadow-[0_2px_8px_rgba(99,102,241,0.3)] transition-colors"
              )}
            >
              <ArrowRight size={12} />
              Continue to {nextDestName ?? "next stage"}
            </motion.button>
          )}
          {allDone && !onAdvance && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <Check size={12} /> Journey Complete!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function JourneySidebar() {
  const { trip, switchTrip, rollbackToStage, completeObjective, focusedCheckpointId, setFocusedCheckpointId, setArrivalMode, reorderCheckpoints } = useTrip();
  const [collapsed, setCollapsed] = useState(false);

  const completedCount = trip.destinations.filter((d) => d.state === "completed").length;
  const totalCount = trip.destinations.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  function getArrivingLeg(destId: string): TransportLeg | undefined {
    return trip.legs.find((l) => l.toDestinationId === destId);
  }

  /** Advance from the current destination to the next locked one */
  function advanceToNext(currentDestIdx: number) {
    const nextDest = trip.destinations[currentDestIdx + 1];
    if (nextDest) {
      // rollbackToStage sets everything before next as completed and next as current
      rollbackToStage(nextDest.id);
    }
  }

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 h-full z-20 flex flex-row",
        "pointer-events-none"
      )}
    >
      {/* ── Sidebar panel ── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.aside
            key="sidebar"
            initial={{ x: -290, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -290, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={clsx(
              "pointer-events-auto",
              "w-[276px] h-full flex flex-col overflow-hidden",
              // Restrained glass treatment for the sidebar panel
              "bg-white/90 backdrop-blur-xl",
              "border-r border-white/70",
              "shadow-[4px_0_32px_rgba(0,0,0,0.08)]"
            )}
          >
            {/* ── Header ── */}
            <div
              className={clsx(
                "px-4 pt-4 pb-3 shrink-0",
                "border-b border-slate-200/60",
                "bg-white/60 backdrop-blur-sm"
              )}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <MapPin size={13} className="text-indigo-500 shrink-0" />
                <select
                  value={trip.id}
                  onChange={(e) => {
                    if (e.target.value === "trip-1") switchTrip(demoTrip);
                    else if (e.target.value === "trip-2") switchTrip(demoFlightTrip);
                  }}
                  className="flex-1 bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer truncate"
                >
                  <option value="trip-1">{demoTrip.name}</option>
                  <option value="trip-2">{demoFlightTrip.name}</option>
                </select>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2.5">
                <div className="flex-1 h-1 rounded-full bg-slate-100/80 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[11px] font-bold text-indigo-600 shrink-0 tabular-nums">
                  {progress}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {completedCount} of {totalCount} stages complete
              </p>
            </div>

            {/* ── Stage list ── */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {trip.destinations.map((dest, idx) => {
                const arrivingLeg = getArrivingLeg(dest.id);
                const isCompleted = dest.state === "completed";
                const isCurrent   = dest.state === "current";
                const isLocked    = dest.state === "locked";
                const nextDest    = trip.destinations[idx + 1];

                return (
                  <div key={dest.id}>
                    {/* Leg connector above every destination except the first */}
                    {arrivingLeg && <LegConnector leg={arrivingLeg} />}

                    {/* ── Stage card ── */}
                    <div
                      className={clsx(
                        "rounded-xl px-3 py-2.5 transition-all duration-200",
                        // Glass surfaces — different intensity per state
                        isCurrent && [
                          "bg-amber-50/70 backdrop-blur-sm",
                          "border border-amber-200/60",
                          "shadow-[0_2px_12px_rgba(251,191,36,0.10)]",
                        ],
                        isCompleted && [
                          "bg-white/50 backdrop-blur-sm",
                          "border border-white/80",
                          "shadow-[0_1px_6px_rgba(0,0,0,0.04)]",
                          "cursor-pointer hover:bg-indigo-50/60 hover:border-indigo-200/60",
                        ],
                        isLocked && [
                          "bg-slate-50/40 backdrop-blur-sm",
                          "border border-slate-200/30",
                          "opacity-55",
                        ]
                      )}
                      onClick={() => {
                        if (isCompleted) rollbackToStage(dest.id);
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Stage number bubble */}
                        <div
                          className={clsx(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5",
                            isCompleted && "bg-emerald-100/80 text-emerald-700",
                            isCurrent   && "bg-amber-100/80 text-amber-700",
                            isLocked    && "bg-slate-100/60 text-slate-400"
                          )}
                        >
                          {idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <StateIcon state={dest.state} />
                            <span
                              className={clsx(
                                "text-[13px] font-semibold truncate leading-tight",
                                isCompleted && "text-slate-800",
                                isCurrent   && "text-amber-900",
                                isLocked    && "text-slate-400"
                              )}
                            >
                              {dest.name}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {dest.state === "completed" && (
                              <span>Completed · <span className="text-indigo-400">tap to return</span></span>
                            )}
                            {dest.state === "current" && "In Progress"}
                            {dest.state === "locked" && "Upcoming"}
                          </p>

                          {/* Checkpoints summary for locked */}
                          {isLocked && dest.checkpoints.length > 0 && (
                            <ul className="mt-1 space-y-0.5">
                              {dest.checkpoints.map((cp) => (
                                <li key={cp.id} className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                  {cp.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Inline quest for current destination */}
                      {isCurrent && (
                        <InlineQuest
                          destination={dest}
                          completeObjective={completeObjective}
                          onAdvance={idx < trip.destinations.length - 1 ? () => advanceToNext(idx) : undefined}
                          nextDestName={trip.destinations[idx + 1]?.name}
                          focusedCheckpointId={focusedCheckpointId}
                          setFocusedCheckpointId={setFocusedCheckpointId}
                          setArrivalMode={setArrivalMode}
                          reorderCheckpoints={reorderCheckpoints}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Footer ── */}
            <div
              className={clsx(
                "shrink-0 px-4 py-2.5",
                "border-t border-slate-200/50",
                "bg-white/50 backdrop-blur-sm",
                "flex items-center justify-between"
              )}
            >
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">
                Itinera
              </span>
              <span className="text-[9px] text-slate-300 truncate ml-2">
                {trip.destinations[0]?.name} → {trip.destinations[trip.destinations.length - 1]?.name}
              </span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Collapse / Expand toggle ── */}
      <div className="pointer-events-auto flex flex-col items-center justify-center ml-0 self-start mt-24">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={clsx(
            "w-5 h-10 flex items-center justify-center",
            "bg-white/90 backdrop-blur-xl",
            "border border-white/70 border-l-0 rounded-r-lg",
            "shadow-[2px_0_8px_rgba(0,0,0,0.08)]",
            "hover:bg-slate-50/90 transition-colors text-slate-400"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>
    </div>
  );
}
