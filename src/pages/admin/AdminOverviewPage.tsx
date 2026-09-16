import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { StudentGrowthChart } from "@/components/admin/charts/StudentGrowthChart";
import { CategoryDistributionChart } from "@/components/admin/charts/CategoryDistributionChart";
import { CouponManager } from "@/components/admin/CouponManager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Users, GraduationCap, ArrowRight, Percent, ShieldCheck, Wallet } from "lucide-react";
import { useAdminOverviewQuery, useAdminWalletQuery } from "@/hooks/queries/useAdminQuery";

export const AdminOverviewPage: React.FC = () => {
  const { data: overview, isLoading } = useAdminOverviewQuery();
  const { data: wallet } = useAdminWalletQuery();

  const monthlyGrowth = overview?.monthlyGrowth || [];
  const categoryStats = overview?.categoryStats || [];
  const recentTransactions = overview?.recentTransactions || [];

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading platform metrics…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dummy payments credit the admin wallet. Monitor GMV, commission, and enrollments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          label="Total Platform GMV"
          value={formatPrice(overview?.totalRevenue || 0)}
          icon={<DollarSign className="h-5 w-5" />}
          tone="sky"
        />
        <Kpi
          label="Admin Net Revenue"
          value={formatPrice(overview?.adminNetCommission || 0)}
          icon={<Percent className="h-5 w-5" />}
          tone="emerald"
          hint="5% instructors + 100% admin courses"
        />
        <Kpi
          label="Dummy Admin Wallet"
          value={formatPrice(wallet?.balance ?? overview?.dummyWalletBalance ?? 0)}
          icon={<Wallet className="h-5 w-5" />}
          tone="emerald"
          hint="Student dummy taka lands here"
        />
        <Kpi
          label="Instructors & Courses"
          value={`${overview?.totalInstructors || 0} / ${overview?.totalCourses || 0}`}
          icon={<GraduationCap className="h-5 w-5" />}
          tone="amber"
          hint={`${overview?.activeEnrollments || 0} enrollments · ${overview?.totalStudents || 0} students`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniStat label="Total Platform Volume" value={formatPrice(overview?.totalRevenue || 0)} />
        <MiniStat label="Admin Net Revenue" value={formatPrice(overview?.adminNetCommission || 0)} />
        <MiniStat label="Instructor Payouts" value={formatPrice(overview?.instructorPayouts || 0)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <RevenueChart data={monthlyGrowth} />
        </div>
        <div className="lg:col-span-1 h-full">
          <CategoryDistributionChart data={categoryStats} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <StudentGrowthChart data={monthlyGrowth} />
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-semibold text-base">Recent Platform Sales</h3>
              <p className="text-xs text-muted-foreground">Dummy transactions with 5% & 100% split</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary">
              <Link to="/admin/revenue">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition border text-xs"
              >
                <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                  <p className="font-semibold text-foreground truncate">{txn.courseTitle}</p>
                  <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                    <span>{txn.studentName}</span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] py-0 px-1.5 ${
                        txn.creatorType === "admin"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                          : "border-sky-500/30 bg-sky-500/10 text-sky-600"
                      }`}
                    >
                      {txn.creatorType === "admin" ? "Admin (100%)" : "Instructor (5% Fee)"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="font-bold text-foreground text-sm">{formatPrice(txn.price)}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    +{formatPrice(txn.adminCommissionAmount)} cut
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CouponManager />
    </div>
  );
};

function Kpi({
  label,
  value,
  icon,
  tone,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: string;
  hint?: string;
}) {
  return (
    <div className="p-5 rounded-xl border bg-card shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`h-9 w-9 rounded-lg bg-${tone}-500/10 text-${tone}-600 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {hint && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          {hint}
        </p>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 rounded-xl border bg-card shadow-sm space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <span>{label}</span>
        <ShieldCheck className="h-4 w-4" />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

export default AdminOverviewPage;
