import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CategoryStat } from "@/types/admin";
import { formatPrice } from "@/lib/formatPrice";
import { Layers } from "lucide-react";

interface CategoryDistributionProps {
  data: CategoryStat[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2.5 shadow-lg text-xs space-y-1">
        <p className="font-bold text-foreground">{data.name}</p>
        <p className="text-muted-foreground">Courses: {data.count}</p>
        <p className="font-semibold text-primary">Revenue: {formatPrice(data.revenue)}</p>
      </div>
    );
  }
  return null;
};

export const CategoryDistributionChart: React.FC<CategoryDistributionProps> = ({ data }) => {
  const totalRev = data.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-base">Course Categories & Revenue</h3>
            <p className="text-xs text-muted-foreground">Market share by domain</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{data.length} Categories</span>
      </div>

      {/* Recharts Pie Donut Chart */}
      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={4}
              dataKey="revenue"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Solid Progress Bars for each category */}
      <div className="space-y-3 pt-1">
        {data.map((cat, i) => {
          const percent = totalRev > 0 ? Math.round((cat.revenue / totalRev) * 100) : 0;
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground text-[11px]">({cat.count})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{formatPrice(cat.revenue)}</span>
                  <span className="text-muted-foreground font-mono w-7 text-right">{percent}%</span>
                </div>
              </div>

              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-lg bg-muted/40 border text-xs flex items-center justify-between">
        <span className="text-muted-foreground">Total Revenue:</span>
        <span className="font-bold text-sm text-foreground">{formatPrice(totalRev)}</span>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;
