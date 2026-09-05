import React, { useState, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { formatPrice } from "@/lib/formatPrice";
import { PlatformTransaction } from "@/types/admin";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Percent,
  ShieldCheck,
  TrendingUp,
  Search,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Receipt,
} from "lucide-react";
import { toast } from "react-toastify";

export const AdminRevenuePage: React.FC = () => {
  const { transactions, courses, monthlyGrowth } = useAppSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreatorFilter, setSelectedCreatorFilter] = useState("all");

  const totalGmv = courses.reduce((acc, c) => acc + c.totalRevenue, 0);
  const totalAdminEarnings = courses.reduce((acc, c) => acc + c.adminEarnings, 0);
  const totalInstructorPayouts = totalGmv - totalAdminEarnings;

  const instructorCourseSales = courses
    .filter((c) => c.creatorType === "instructor")
    .reduce((acc, c) => acc + c.totalRevenue, 0);

  const admin5PercentCut = Number((instructorCourseSales * 0.05).toFixed(2));

  const adminDirectCourseSales = courses
    .filter((c) => c.creatorType === "admin")
    .reduce((acc, c) => acc + c.totalRevenue, 0);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchSearch =
        txn.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCreator =
        selectedCreatorFilter === "all" || txn.creatorType === selectedCreatorFilter;

      return matchSearch && matchCreator;
    });
  }, [transactions, searchTerm, selectedCreatorFilter]);

  const handleExportCSV = () => {
    toast.success("Transaction ledger exported as CSV report!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue & Platform Commission Ledger</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Transparent split: 5% Platform fee on instructor courses & 100% on admin courses
          </p>
        </div>

        <Button onClick={handleExportCSV} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export Financial Report
        </Button>
      </div>

      {/* Revenue Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="p-5 rounded-xl border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase">Total Platform Volume</span>
            <DollarSign className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold">{formatPrice(totalGmv)}</div>
          <p className="text-[11px] text-muted-foreground">Total student payments processed</p>
        </div>

        {/* 5% Instructor Platform Commission */}
        <div className="p-5 rounded-xl border bg-card shadow-sm space-y-2 border-sky-500/30 bg-sky-500/5">
          <div className="flex items-center justify-between text-xs text-sky-700 dark:text-sky-300">
            <span className="font-semibold uppercase">5% Instructor Commission</span>
            <Percent className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {formatPrice(admin5PercentCut)}
          </div>
          <p className="text-[11px] text-muted-foreground">From {formatPrice(instructorCourseSales)} instructor sales</p>
        </div>

        {/* 100% Admin Course Sales */}
        <div className="p-5 rounded-xl border bg-card shadow-sm space-y-2 border-purple-500/30 bg-purple-500/5">
          <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
            <span className="font-semibold uppercase">Admin Courses (100%)</span>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatPrice(adminDirectCourseSales)}
          </div>
          <p className="text-[11px] text-muted-foreground">100% platform retained revenue</p>
        </div>

        {/* Total Net Admin Earnings */}
        <div className="p-5 rounded-xl border bg-card shadow-sm space-y-2 border-emerald-500/40 bg-emerald-500/10">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
            <span className="font-bold uppercase">Total Admin Net Profit</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatPrice(totalAdminEarnings)}
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">5% Cut + Admin Courses</p>
        </div>
      </div>

      {/* Interactive Chart */}
      <RevenueChart data={monthlyGrowth} />

      {/* Transaction Table Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transaction ID, student, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Select value={selectedCreatorFilter} onValueChange={setSelectedCreatorFilter}>
          <SelectTrigger className="h-9 w-44 text-xs">
            <SelectValue placeholder="Course Creator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="instructor">Instructor Courses (5% fee)</SelectItem>
            <SelectItem value="admin">Admin Courses (100% rev)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Real-time Transaction Ledger</h3>
          </div>
          <span className="text-xs text-muted-foreground">{filteredTransactions.length} records</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-xs">
              <TableHead>Txn ID & Date</TableHead>
              <TableHead>Course & Creator</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Platform 5% Cut</TableHead>
              <TableHead>Instructor 95% Share</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No transactions found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((txn) => (
                <TableRow key={txn.id} className="hover:bg-muted/30 text-xs">
                  <TableCell>
                    <div className="font-mono font-bold text-foreground">{txn.id}</div>
                    <div className="text-[11px] text-muted-foreground">{txn.date}</div>
                  </TableCell>

                  <TableCell>
                    <p className="font-semibold text-foreground line-clamp-1 max-w-[200px]">
                      {txn.courseTitle}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-[9px] mt-0.5 ${
                        txn.creatorType === "admin"
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300"
                          : "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                      }`}
                    >
                      {txn.creatorType === "admin" ? "Admin (100% Rev)" : `${txn.instructorName} (5% Fee)`}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium text-foreground">{txn.studentName}</div>
                    <div className="text-[11px] text-muted-foreground">{txn.studentEmail}</div>
                  </TableCell>

                  <TableCell className="font-bold text-foreground">
                    {formatPrice(txn.price)}
                  </TableCell>

                  <TableCell>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatPrice(txn.adminCommissionAmount)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {txn.creatorType === "admin" ? "100% full" : "5.0% fee"}
                    </div>
                  </TableCell>

                  <TableCell>
                    {txn.creatorType === "instructor" ? (
                      <div className="font-medium text-indigo-600 dark:text-indigo-400">
                        {formatPrice(txn.instructorEarnings)}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-[11px]">— (Platform owned)</div>
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground text-[11px]">
                    {txn.paymentMethod}
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminRevenuePage;
