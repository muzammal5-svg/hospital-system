"use client";

import React from "react";
import { AlertCircle, Clock, Users, ArrowRight } from "lucide-react";

export interface QueueAlert {
  id: string;
  type: "alert" | "balance" | "schedule";
  title: string;
  desc: string;
  actionText?: string;
}

interface QueueAlertsCardsProps {
  alerts?: QueueAlert[];
  insights?: any[];
  onActionClick?: (id: string) => void;
}

export function QueueAlertsCards({ alerts, insights, onActionClick }: QueueAlertsCardsProps) {
  const fallbackAlerts: QueueAlert[] = [
    {
      id: "qa-1",
      type: "balance",
      title: "OPD Queue Balancing",
      desc: "Dr. Ahmed Bilal has 18 patients waiting in Room 103. Dr. Sana Farooq has 2 waiting in Room 102. Consider moving walk-in consultations to reduce lobby wait time.",
      actionText: "Balance Queue",
    },
    {
      id: "qa-2",
      type: "alert",
      title: "Priority Care Notice",
      desc: "2 urgent priority arrivals registered at Reception Desk 1. Emergency room and OPD Room 101 notified for priority consultation.",
      actionText: "View Triage",
    },
    {
      id: "qa-3",
      type: "schedule",
      title: "Morning OPD Peak Hours",
      desc: "High morning OPD attendance expected between 10:00 AM and 1:00 PM. All 8 consultant rooms are staffed and operational.",
      actionText: "View Schedule",
    },
  ];

  const candidateList = alerts || insights;
  const items = candidateList && candidateList.length > 0 ? candidateList : fallbackAlerts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {items.map((item) => {
        const isUrgent = item.type === "alert";
        const isSchedule = item.type === "schedule";

        return (
          <div
            key={item.id}
            className="hospital-card p-5 transition-colors border border-[#E3E9EF] dark:border-[#23374D] bg-white dark:bg-[#162638] rounded-xl flex flex-col justify-between"
          >
            <div>
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isUrgent
                      ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800"
                      : isSchedule
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      : "bg-[#E6F5F3] text-[#167C70] dark:bg-teal-950/40 dark:text-teal-300 border border-[#1E9E8F]/20"
                  }`}
                >
                  {isUrgent ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : isSchedule ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <Users className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isUrgent
                      ? "Priority Alert"
                      : isSchedule
                      ? "Peak Schedule"
                      : "Queue Status"}
                  </span>
                </span>
                <span className="text-[11px] text-[#8A97A5] font-medium">Live</span>
              </div>

              {/* Title & Description */}
              <h4 className="text-sm font-bold text-[#1B2733] dark:text-[#E6EEF5] mb-1.5 font-heading">
                {item.title}
              </h4>
              <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] leading-relaxed mb-4">
                {item.desc}
              </p>
            </div>

            {/* Action link */}
            {item.actionText && (
              <button
                type="button"
                onClick={() => onActionClick && onActionClick(item.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B4F8A] dark:text-[#64B5F6] hover:underline cursor-pointer pt-2 border-t border-[#E3E9EF] dark:border-[#23374D]"
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

// Backward compatibility alias
export { QueueAlertsCards as AiInsightCards };
