"use client";

import React from "react";
import { Sparkles, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";

interface AiInsight {
  id: string;
  type: "alert" | "recommendation" | "optimization";
  title: string;
  desc: string;
  actionText?: string;
}

interface AiInsightCardsProps {
  insights?: AiInsight[];
  onActionClick?: (id: string) => void;
  isDarkTheme?: boolean;
}

export function AiInsightCards({ insights, onActionClick, isDarkTheme = false }: AiInsightCardsProps) {
  const fallbackInsights: AiInsight[] = [
    {
      id: "ai-1",
      type: "recommendation",
      title: "OPD Load Balancing",
      desc: "Dr. Ahmed Bilal has 14 patients waiting in Cardiology OPD. Move 4 walk-ins to Dr. Sana Farooq (2 waiting) to decrease average lobby wait time from 38m to 14m.",
      actionText: "Apply Rebalance",
    },
    {
      id: "ai-2",
      type: "alert",
      title: "Fast-Track Priority Alert",
      desc: "2 Emergency triage patients registered at Desk 1. Automated audio chime notified OPD Room 101 for priority consultation handover.",
      actionText: "View Triage",
    },
    {
      id: "ai-3",
      type: "optimization",
      title: "Peak Footfall Prediction",
      desc: "OPD footfall model forecasts peak surge at 11:00 AM today (+32% vs yesterday). Front-desk keyboard shortcut mode (F2/F4) active.",
      actionText: "Review Staffing",
    },
  ];

  const items = insights && insights.length > 0 ? insights : fallbackInsights;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => {
        const isAlert = item.type === "alert";
        const isOptimization = item.type === "optimization";

        return (
          <div
            key={item.id}
            className={`relative rounded-2xl p-6 transition-all border ${
              isDarkTheme
                ? "bg-[#0A0A0A] border-white/10 hover:border-teal-500/40 text-[#EDE8E0]"
                : "bg-white dark:bg-[#0B0F14] border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-neutral-100 shadow-card-soft"
            }`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  isAlert
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : isOptimization
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                }`}
              >
                {isAlert ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : isOptimization ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>AI Operational Insight</span>
              </span>

              <span className="text-[10px] text-neutral-400 font-mono">Live Rule</span>
            </div>

            {/* Title & Description */}
            <h4 className="text-base font-bold font-display tracking-tight mb-2">
              {item.title}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-[#9A958C] leading-relaxed mb-6">
              {item.desc}
            </p>

            {/* Action button */}
            {item.actionText && (
              <button
                type="button"
                onClick={() => onActionClick && onActionClick(item.id)}
                className={`inline-flex items-center gap-2 text-xs font-bold transition-colors ${
                  isDarkTheme
                    ? "text-teal-400 hover:text-teal-300"
                    : "text-teal-600 dark:text-teal-400 hover:text-teal-700"
                }`}
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
