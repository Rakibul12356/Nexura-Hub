import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { formatPrice } from "@/lib/formatPrice";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { StudentGrowthChart } from "@/components/admin/charts/StudentGrowthChart";
import { CategoryDistributionChart } from "@/components/admin/charts/CategoryDistributionChart";
import { CouponManager } from "@/components/admin/CouponManager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DollarSign,
  TrendingUp,
  Users,
  GraduationCap,
  ArrowRight,
  Percent,
} from "lucide-react";

export const AdminOverviewPage: React.FC = () => {
  const { courses, users, transactions, monthlyGrowth, categoryStats } = useAppSelector(
    (state) => state.admin
  );

  const students = users.filter((u) => u.role === "student");
  const instructors = users.filter((u) => u.role === "instructor");

  const totalGmv = courses.reduce((acc, c) => acc + c.totalRevenue, 0);
  const totalAdminEarnings = courses.reduce((acc, c) => acc + c.adminEarnings, 0);
  const totalInstructorPayouts = totalGmv - totalAdminEarnings;
  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrollmentsCount, 0);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor real-time platform metrics, course sales, and revenue performance.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Platform GMV
            </span>
            <div className="h-9 w-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{formatPrice(totalGmv)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">+24.8%</span> from last month
            </p>
          </div>
        </div>

        {/* Admin Net Earnings (5% + 100%) */}
        <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition space-y-3 border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Admin Net Revenue
            </span>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice(totalAdminEarnings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>5%</strong> on Instructors + <strong>100%</strong> Admin Courses
            </p>
          </div>
        </div>

        {/* Total Students */}
        <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Students
            </span>
            <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{students.length + 840}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">1,240+</span> active learners
            </p>
          </div>
        </div>

        {/* Total Instructors & Courses */}
        <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Instructors & Courses
            </span>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {instructors.length} <span className="text-sm font-normal text-muted-foreground">Inst. /</span> {courses.length} <span className="text-sm font-normal text-muted-foreground">Courses</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalEnrollments.toLocaleString()} total course enrollments
            </p>
          </div>
        </div>
      </div>

      {/* Main Revenue & Growth Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyGrowth} />
        </div>
        <div className="lg:col-span-1">
          <CategoryDistributionChart data={categoryStats} />
        </div>
      </div>

      {/* Secondary Chart & Recent Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Growth Trends */}
        <StudentGrowthChart data={monthlyGrowth} />

        {/* Live Transaction Ledger Stream */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-semibold text-base">Recent Platform Sales</h3>
              <p className="text-xs text-muted-foreground">Live transactions with 5% & 100% split</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary">
              <Link to="/admin/revenue">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition border text-xs"
              >
                <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                  <p className="font-semibold text-foreground truncate">{txn.courseTitle}</p>
                  <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                    <span>{txn.studentName}</span>
                    <span>•</span>
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
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    +{formatPrice(txn.adminCommissionAmount)} cut
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coupon Engine Management */}
      <CouponManager />
    </div>
  );
};

export default AdminOverviewPage;
