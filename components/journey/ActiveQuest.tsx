"use client";

import { useTrip } from "@/components/providers/TripProvider";
import { Destination } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Check } from "lucide-react";
import { TransportIcon } from "@/components/ui/TransportIcon";
import clsx from "clsx";

export function ActiveQuest({ destination }: { destination: Destination }) {
  const { completeObjective } = useTrip();
  
  const allCompleted = destination.quest.objectives.every(o => o.completed);
  const progress = (destination.quest.objectives.filter(o => o.completed).length / destination.quest.objectives.length) * 100;

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden pointer-events-auto flex flex-col"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-lg text-quest">
            <TransportIcon mode="walking" size={18} />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-slate-800 leading-tight">{destination.quest.title}</h3>
            <p className="text-xs text-slate-500">{destination.name}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-quest">{Math.round(progress)}%</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100">
        <motion.div 
          className="h-full bg-quest" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-600 mb-2">{destination.quest.description}</p>
        
        <div className="space-y-2">
          {destination.quest.objectives.map((obj) => (
            <div 
              key={obj.id}
              onClick={() => !obj.completed && completeObjective(destination.id, obj.id)}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-xl transition-all",
                obj.completed 
                  ? "bg-slate-50 opacity-60" 
                  : "bg-white border border-slate-200 cursor-pointer hover:border-quest hover:shadow-sm"
              )}
            >
              <div className={clsx("flex-shrink-0 transition-colors", obj.completed ? "text-success" : "text-slate-300")}>
                <AnimatePresence mode="wait">
                  {obj.completed ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckCircle size={20} className="fill-emerald-100" />
                    </motion.div>
                  ) : (
                    <motion.div key="circle">
                      <Circle size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className={clsx("text-sm font-medium", obj.completed && "line-through text-slate-400")}>
                {obj.title}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {allCompleted && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 p-3 bg-emerald-50 rounded-xl flex items-center justify-center gap-2 text-success font-medium text-sm"
            >
              <Check size={16} /> Destination Completed!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
