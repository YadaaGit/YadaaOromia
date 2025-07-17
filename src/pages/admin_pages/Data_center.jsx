import React, { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTelegramInitData } from "@/hooks/get_tg_data.js";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import * as XLSX from "xlsx";
import { useTranslation } from "@/utils/useTranslation.js";
import { Skeleton } from "@mui/material";
import useAllUsers from "@/hooks/get_all_user.js";
import "@/style/ag-grid.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function UserDashboard() {
  const { t } = useTranslation();
  const [showAgeModal, setShowAgeModal] = useState(false);
  const { initDataState } = useTelegramInitData();
  const [exportStatus, setExportStatus] = useState("idle");

  const columnDefs = useMemo(
    () => [
      { field: "name", sortable: true, filter: true },
      { field: "email", sortable: true, filter: true },
      { field: "gender", sortable: true, filter: true },
      { field: "age", sortable: true, filter: true },
      { field: "role", sortable: true, filter: true },
      { field: "lang", sortable: true, filter: true },
      {
        headerName: "Program Progress",
        valueGetter: (params) => {
          const progress = params.data.course_progress || {};
          const programs = Object.entries(progress);
          if (programs.length === 0) return "—";
          return programs
            .map(([programId, data]) => {
              const status = data.completed
                ? "✅ Completed"
                : `📘 Course ${data.current_course}`;
              const score = data.final_quiz_score
                ? ` - Score: ${data.final_quiz_score}%`
                : "";
              return `${programId}: ${status}${score}`;
            })
            .join(" | ");
        },
        cellClass: "text-sm text-logo-700 whitespace-pre-wrap",
      },
      { field: "joined", headerName: "Joined Date", sortable: true },
    ],
    []
  );

  const { users, loading, error } = useAllUsers({ includeCourses: true });

  const getSummary = () => {
    const total = users.length;
    const male = users.filter((u) => u.gender === "m").length;
    const female = users.filter((u) => u.gender === "f").length;

    // Calculate mode (most frequent age)
    const ageCounts = {};
    users.forEach((u) => {
      const age = parseInt(u.age);
      if (!isNaN(age)) {
        ageCounts[age] = (ageCounts[age] || 0) + 1;
      }
    });

    let mostFrequentAge = 0;
    let maxCount = 0;
    Object.entries(ageCounts).forEach(([age, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentAge = age;
      }
    });

    const startedCourses = {};
    const finishedCourses = {};
    const ageGroups = {
      "10-15": 0,
      "15-20": 0,
      "20-25": 0,
      "25-30": 0,
      "30-35": 0,
      "35-40": 0,
      "40-45": 0,
      "45-50": 0,
      "50-55": 0,
      "55-60": 0,
    };

    users.forEach((user) => {
      const age = parseInt(user.age);
      if (!isNaN(age)) {
        for (let i = 10; i < 60; i += 5) {
          if (age >= i && age < i + 5) {
            const key = `${i}-${i + 5}`;
            if (ageGroups[key] !== undefined) ageGroups[key]++;
            break;
          }
        }
      }

      const courseProgress = user.course_progress || {};
      Object.entries(courseProgress).forEach(([courseId, progress]) => {
        const started =
          (progress.current_module === 1 && progress.current_section > 1) ||
          progress.current_module > 1;

        if (started)
          startedCourses[courseId] = (startedCourses[courseId] || 0) + 1;
        if (progress.final_quiz_score > 75)
          finishedCourses[courseId] = (finishedCourses[courseId] || 0) + 1;
      });
    });

    const mostStarted =
      Object.entries(startedCourses).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    const mostFinished =
      Object.entries(finishedCourses).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "-";

    return {
      total,
      male,
      female,
      avgAge: mostFrequentAge,
      mostStarted,
      mostFinished,
      ageGroups,
    };
  };

  const summary = !loading && getSummary();

  const exportToExcel = async () => {
    const exportPromise = new Promise(async (resolve, reject) => {
      setExportStatus("loading");
      try {
        const formattedUsers = users.map((user) => {
          const progress = user.course_progress || {};
          const programs = Object.entries(progress).map(([programId, data]) => {
            const status = data.completed
              ? "Completed"
              : `Course ${data.current_course}`;
            const score = data.final_quiz_score
              ? ` (Score: ${data.final_quiz_score}%)`
              : "";
            return `${programId}: ${status}${score}`;
          });

          return {
            Name: user.name,
            Email: user.email,
            Gender: user.gender,
            Age: user.age,
            Country: user.country,
            City: user.city,
            Language: user.lang,
            Role: user.role,
            Joined: user.joined,
            "Telegram ID": user.telegramId,
            "Last Active": user.lastActiveAt,
            "Program Progress": programs.join(" | "),
          };
        });

        const ws = XLSX.utils.json_to_sheet(formattedUsers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        // Use modern save file picker if available
        if (window.showSaveFilePicker) {
          try {
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: "users.xlsx",
              types: [
                {
                  description: "Excel Files",
                  accept: {
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                      [".xlsx"],
                  },
                },
              ],
            });

            const writable = await fileHandle.createWritable();
            await writable.write(buf);
            await writable.close();
            resolve(); // Success!
            setExportStatus("success");
            return;
          } catch (pickerError) {
            if (pickerError.name !== "AbortError") {
              reject(pickerError);
              return;
            }
            // fall through to fallback
          }
        }

        // Fallback: Ask user for filename
        let filename = prompt("Enter a name for the file:", "users.xlsx");
        if (!filename) {
          toast.error("Export cancelled.");
          return;
        }
        if (!filename.endsWith(".xlsx")) filename += ".xlsx";

        // Create and download the file
        const blob = new Blob([buf], { type: "application/octet-stream" });
        if (initDataState.user) {
          // Inside Telegram – fallback to external method
          const fileBlob = new Blob([buf], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          const url = URL.createObjectURL(fileBlob);
          toast.custom(
            (t) => (
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#333",
                  color: "white",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: 8 }}>Download your file here:</span>
                <a
                  href={url}
                  download="users.xlsx"
                  style={{ color: "#4ade80", textDecoration: "underline" }}
                  onClick={() => {
                    toast.dismiss(t.id);
                    URL.revokeObjectURL(url);
                  }} // dismiss toast and clean url on click
                >
                  Click to download
                </a>
              </div>
            ),
            { duration: 10000 }
          );
        } else {
          // Normal fallback with a.download
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "users.xlsx";
          a.click();
        }
        resolve(); // Success!
      } catch (err) {
        console.error("Export failed:", err);
        reject(err); // Fail
      }
    });
    setExportStatus("idle");
    toast.promise(exportPromise, {
      loading: "Exporting...",
      success: "Excel file downloaded successfully!",
      error: "Something went wrong during export.",
    });
  };

  if (loading || !users)
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width={180} height={32} />
          <Skeleton variant="rectangular" width={140} height={40} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={100}
              className="rounded-xl"
            />
          ))}
        </div>
        <Skeleton variant="rectangular" height={500} className="rounded-xl" />
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500 font-medium bg-red-100 p-4 rounded-lg border border-red-300">
          {error}
        </p>
      </div>
    );

  return (
    <div className="p-6 space-y-8 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("user_view")}</h2>
        <button
          onClick={exportToExcel}
          disabled={exportStatus === "loading"}
          className="px-4 py-2 rounded-lg bg-amber-200 text-logo-800 font-semibold shadow hover:bg-amber-300 transition disabled:opacity-50"
        >
          {exportStatus === "loading" ? "Exporting..." : "Download Excel"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Users" value={summary.total} />
        <SummaryCard
          label="Male %"
          value={`${((summary.male / summary.total) * 100).toFixed(1)}%`}
        />
        <SummaryCard
          label="Female %"
          value={`${((summary.female / summary.total) * 100).toFixed(1)}%`}
        />
        <SummaryCard
          label="Frequent Age"
          value={summary.avgAge}
          onClick={() => setShowAgeModal(true)}
          isClickable
        />
        <SummaryCard label="Most Started" value={summary.mostStarted} />
        <SummaryCard label="Most Finished" value={summary.mostFinished} />
      </div>

      <div
        className="rounded-xl border border-gray-200 overflow-hidden shadow"
        style={{ height: 500 }}
      >
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          pagination={true}
          theme={themeQuartz}
        />
      </div>

      {showAgeModal && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center"
          onClick={() => setShowAgeModal(false)}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Age Group Breakdown
              </h3>
              <button
                onClick={() => setShowAgeModal(false)}
                className="text-xl font-bold text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {Object.entries(summary.ageGroups).map(([range, count]) => (
                <div
                  key={range}
                  className="flex justify-between text-gray-700"
                  style={{ height: 30 }}
                >
                  <span>{range}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SummaryCard component
function SummaryCard({ label, value, onClick, isClickable }) {
  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center transition hover:shadow-md ${
        isClickable ? "cursor-pointer hover:ring-2 ring-yellow-400" : ""
      }`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-800 break-words">{value}</p>
    </div>
  );
}
