import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { MonthlyGrowthData } from "@/types/admin";
import { Users, GraduationCap, TrendingUp } from "lucide-react";

interface StudentGrowthChartProps {
  data: MonthlyGrowthData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg text-xs space-y-1.5">
        <p className="font-bold text-foreground border-b pb-1">{label} 2026</p>
        <p className="text-sky-600 dark:text-sky-400 font-medium">
          New Students: <strong>{payload[0]?.value}</strong>
        </p>
        <p className="text-purple-600 dark:text-purple-400 font-medium">
          Course Enrollments: <strong>{payload[1]?.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const StudentGrowthChart: React.FC<StudentGrowthChartProps> = ({ data }) => {
  const totalStudents = data.reduce((acc, curr) => acc + curr.students, 0);
  const totalEnrollments = data.reduce((acc, curr) => acc + curr.enrollments, 0);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm h-full flex flex-col justify-between space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">Student Growth & Enrollments</h3>
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <TrendingUp className="h-3 w-3" /> +35% Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monthly new student acquisitions vs course enrollments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 shrink-0">
        <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Signups</span>
            <Users className="h-3.5 w-3.5 text-sky-500" />
          </div>
          <div className="text-lg font-bold mt-1 text-foreground">{totalStudents.toLocaleString()}</div>
        </div>
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Enrollments</span>
            <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <div className="text-lg font-bold mt-1 text-purple-600 dark:text-purple-400">
            {totalEnrollments.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Recharts BarChart */}
      <div className="w-full flex-1 min-h-[260px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "currentColor" }}
              tickLine={false}
              axisLine={{ strokeOpacity: 0.2 }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickLine={false}
              axisLine={{ strokeOpacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 6 }}
              formatter={(value) => (value === "students" ? "New Students" : "Enrollments")}
            />
            <Bar dataKey="students" fill="#0284c7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="enrollments" fill="#9333ea" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentGrowthChart;
