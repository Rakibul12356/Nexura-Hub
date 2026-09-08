import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { MonthlyGrowthData } from "@/types/admin";
import { formatPrice } from "@/lib/formatPrice";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: MonthlyGrowthData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg text-xs space-y-1.5">
        <p className="font-bold text-foreground border-b pb-1">{label} 2026</p>
        <p className="text-sky-600 dark:text-sky-400 font-medium">
          Total Platform GMV: <strong>{formatPrice(payload[0]?.value || 0)}</strong>
        </p>
        <p className="text-emerald-600 dark:text-emerald-400 font-medium">
          Admin Net (5%+Self): <strong>{formatPrice(payload[1]?.value || 0)}</strong>
        </p>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium">
          Instructor Cut (95%): <strong>{formatPrice(payload[2]?.value || 0)}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm h-full flex flex-col justify-between space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base sm:text-lg">Platform Revenue & Commission Analytics</h3>
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +28.4% MoM
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            5% Platform Commission from instructor courses + 100% Admin courses revenue
          </p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full min-h-[360px] pt-2">
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              formatter={(value) => {
                if (value === "gmv") return "Total GMV";
                if (value === "adminRevenue") return "Admin Net (5% + Self)";
                if (value === "instructorEarnings") return "Instructor Share (95%)";
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="gmv"
              stroke="#0284c7"
              strokeWidth={2.5}
              fill="#0284c7"
              fillOpacity={0.15}
            />
            <Area
              type="monotone"
              dataKey="adminRevenue"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="#10b981"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="instructorEarnings"
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="#6366f1"
              fillOpacity={0.08}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
