import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/formatPrice";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Radio,
  BookA,
  ArrowRight,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export const DashboardOverviewPage: React.FC = () => {
  const { stats, enrollments, instructorCourses } = useAppSelector(
    (state) => state.dashboard
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Instructor Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your published courses, student enrollments, and earnings
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-700 gap-1.5">
            <Link to="/dashboard/courses/add">
              <PlusCircle className="h-4 w-4" />
              New Course
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link to="/dashboard/lives/add">
              <Radio className="h-4 w-4 text-rose-500" />
              Schedule Live
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link to="/dashboard/quiz-sets/add">
              <BookA className="h-4 w-4 text-indigo-500" />
              Create Quiz
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructorCourses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active published & draft courses
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Enrollments
            </CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime gross earnings
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique enrolled students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Recent Enrollments</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest student sign-ups across all your courses
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-sky-600">
            <Link to="/dashboard/courses">
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Progress</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrollments.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-semibold text-foreground">
                          {item.studentName}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {item.studentEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {item.courseTitle}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {item.enrolledDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-600 h-full rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="success" className="text-xs">
                        {item.paymentStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverviewPage;
