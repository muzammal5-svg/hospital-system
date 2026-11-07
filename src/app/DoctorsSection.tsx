"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPKR } from "@/lib/utils";
import { Calendar, Clock, MapPin, Award } from "lucide-react";

interface DoctorData {
  id: string;
  name: string;
  nameUrdu?: string | null;
  qualification: string;
  specialty: string;
  fee: number;
  roomNo: string;
  photoUrl?: string | null;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

interface DepartmentData {
  id: string;
  name: string;
  code: string;
}

export function DoctorsSection({
  doctors,
  departments,
}: {
  doctors: DoctorData[];
  departments: DepartmentData[];
}) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>("ALL");

  const filteredDoctors =
    selectedDeptId === "ALL"
      ? doctors
      : doctors.filter((doc) => doc.departmentId === selectedDeptId);

  return (
    <div>
      {/* Department Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button
          onClick={() => setSelectedDeptId("ALL")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            selectedDeptId === "ALL"
              ? "bg-[#0B4F8A] text-white shadow-sm"
              : "bg-white dark:bg-[#162638] text-[#5B6B7B] dark:text-[#94A7BA] hover:bg-[#E8F1F9] dark:hover:bg-[#1E3147] border border-[#E3E9EF] dark:border-[#23374D]"
          }`}
        >
          All Departments ({doctors.length})
        </button>
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDeptId(dept.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedDeptId === dept.id
                ? "bg-[#0B4F8A] text-white shadow-sm"
                : "bg-white dark:bg-[#162638] text-[#5B6B7B] dark:text-[#94A7BA] hover:bg-[#E8F1F9] dark:hover:bg-[#1E3147] border border-[#E3E9EF] dark:border-[#23374D]"
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Doctors 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDoctors.map((doc) => {
          const photo = doc.photoUrl || "/images/hero-hospital.webp";

          return (
            <div
              key={doc.id}
              className="hospital-card overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                {/* Doctor Headshot */}
                <div className="relative w-full aspect-square bg-[#E8F1F9] overflow-hidden">
                  <Image
                    src={photo}
                    alt={doc.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-[#162638]/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#0B4F8A] dark:text-[#64B5F6] border border-[#E3E9EF] dark:border-[#23374D] shadow-sm">
                    {doc.roomNo}
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#1E9E8F] mb-1">
                    {doc.department?.name || doc.specialty}
                  </div>
                  <h3 className="text-base font-bold text-[#1B2733] dark:text-[#E6EEF5] font-heading mb-1 leading-snug">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-[#5B6B7B] dark:text-[#94A7BA] mb-3 line-clamp-2">
                    {doc.qualification}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-[#E3E9EF] dark:border-[#23374D] text-xs text-[#5B6B7B] dark:text-[#94A7BA]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Mon - Sat</span>
                      </span>
                      <span className="font-medium text-[#1B2733] dark:text-[#E6EEF5]">
                        10:00 AM - 02:00 PM
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Consultation Fee:</span>
                      <span className="font-bold text-[#0B4F8A] dark:text-[#64B5F6]">
                        {formatPKR(doc.fee)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  href={`/appointments?doctorId=${doc.id}`}
                  className="btn-primary w-full justify-center text-xs py-2.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
