// UserDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useUserData from "@/hooks/get_user_data.js";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function UserDashboard() {
  const [rowData, setRowData] = useState([]);

  const columnDefs = useMemo(
    () => [
      { field: "name", sortable: true, filter: true },
      { field: "email", sortable: true, filter: true },
      { field: "username", sortable: true, filter: true },
      { field: "gender", sortable: true, filter: true },
      { field: "age", sortable: true, filter: true },
      { field: "role", sortable: true, filter: true },
      { field: "lang", sortable: true, filter: true },
      { field: "joined", headerName: "Joined Date", sortable: true },
    ],
    []
  );
  const { user, loading, error } = useUserData();

  useEffect(() => {
    if (!user?.authenticated) return;
    // Wrap single user as array for grid
    setRowData([{ ...user }]);
  }, [user]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "users.xlsx");
  };

  const getSummary = () => {
    const total = rowData.length;
    const male = rowData.filter((u) => u.gender === "Male").length;
    const female = rowData.filter((u) => u.gender === "Female").length;
    const avgAge =
      total > 0
        ? Math.round(
            rowData.reduce((sum, u) => sum + (parseInt(u.age) || 0), 0) / total
          )
        : 0;

    const startedCourses = {};
    const finishedCourses = {};

    rowData.forEach((user) => {
      const courseProgress = user.course_progress || {};

      Object.entries(courseProgress).forEach(([courseId, progress]) => {
        const started =
          (progress.current_module === 1 && progress.current_section > 1) ||
          progress.current_module > 1;

        if (started) {
          startedCourses[courseId] = (startedCourses[courseId] || 0) + 1;
        }

        if (progress.final_quiz_score > 75) {
          finishedCourses[courseId] = (finishedCourses[courseId] || 0) + 1;
        }
      });
    });

    const mostStarted =
      Object.entries(startedCourses).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    const mostFinished =
      Object.entries(finishedCourses).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "-";

    return { total, male, female, avgAge, mostStarted, mostFinished };
  };

  const summary = getSummary();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User Overview</h2>
        <button
          onClick={exportToExcel}
          className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
          style={{ color: "#19384c !important" }}
        >
          Download Excel
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
        <SummaryCard label="Avg Age" value={summary.avgAge} />
        <SummaryCard label="Most Users Started" value={summary.mostStarted} />
        <SummaryCard label="Most Users Finished" value={summary.mostFinished} />
      </div>

      <div style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          theme={themeQuartz}
        />
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className="text-lg font-bold text-gray-900"
        style={{ overflow: "scroll" }}
      >
        {value}
      </p>
    </div>
  );
}
