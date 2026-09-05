import React, { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  toggleUserStatus,
  updateUserRole,
  deleteUser,
} from "@/store/slices/adminSlice";
import { formatPrice } from "@/lib/formatPrice";
import { ManagedUser } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  UserX,
  UserCheck,
  GraduationCap,
  Users,
  Mail,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

export const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleTab, setSelectedRoleTab] = useState("all");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole =
        selectedRoleTab === "all" || user.role === selectedRoleTab;

      return matchSearch && matchRole;
    });
  }, [users, searchTerm, selectedRoleTab]);

  const students = users.filter((u) => u.role === "student");
  const instructors = users.filter((u) => u.role === "instructor");
  const admins = users.filter((u) => u.role === "admin");

  const handleToggleStatus = (user: ManagedUser) => {
    const nextStatus = user.status === "active" ? "suspended" : "active";
    dispatch(toggleUserStatus({ userId: user.id, status: nextStatus }));
    toast.success(
      `User ${user.firstName} ${user.lastName} has been ${
        nextStatus === "active" ? "activated" : "suspended"
      }`
    );
  };

  const handleChangeRole = (user: ManagedUser, newRole: ManagedUser["role"]) => {
    dispatch(updateUserRole({ userId: user.id, role: newRole }));
    toast.success(`Role for ${user.firstName} changed to ${newRole}`);
  };

  const handleDelete = (user: ManagedUser) => {
    if (
      window.confirm(
        `Are you sure you want to remove user ${user.firstName} ${user.lastName}?`
      )
    ) {
      dispatch(deleteUser(user.id));
      toast.success("User account removed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all platform students, instructors, and administrators ({users.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline" className="py-1 px-2.5 bg-card">
            <Users className="h-3.5 w-3.5 mr-1 text-sky-500" /> {students.length} Students
          </Badge>
          <Badge variant="outline" className="py-1 px-2.5 bg-card">
            <GraduationCap className="h-3.5 w-3.5 mr-1 text-indigo-500" /> {instructors.length} Instructors
          </Badge>
          <Badge variant="outline" className="py-1 px-2.5 bg-card">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-purple-500" /> {admins.length} Admins
          </Badge>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <Tabs
          value={selectedRoleTab}
          onValueChange={setSelectedRoleTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs">
              All ({users.length})
            </TabsTrigger>
            <TabsTrigger value="student" className="text-xs">
              Students ({students.length})
            </TabsTrigger>
            <TabsTrigger value="instructor" className="text-xs">
              Instructors ({instructors.length})
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-xs">
              Admins ({admins.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-xs">
              <TableHead className="w-[280px]">User Profile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Activity & Metrics</TableHead>
              <TableHead>Financials</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No users found matching query.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border shrink-0">
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`text-xs capitalize font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                          : user.role === "instructor"
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                          : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30"
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {user.role === "instructor" ? (
                      <div className="text-xs space-y-0.5">
                        <span className="font-medium text-foreground">
                          {user.createdCoursesCount || 1} Courses Created
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {user.totalStudentsCount || 0} Students Taught
                        </p>
                      </div>
                    ) : user.role === "student" ? (
                      <div className="text-xs space-y-0.5">
                        <span className="font-medium text-foreground">
                          {user.enrolledCoursesCount || 0} Courses Enrolled
                        </span>
                        <p className="text-[11px] text-muted-foreground">Active Learner</p>
                      </div>
                    ) : (
                      <div className="text-xs text-purple-600 font-semibold">System Administrator</div>
                    )}
                  </TableCell>

                  <TableCell>
                    {user.role === "instructor" ? (
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-foreground">
                          {formatPrice(user.totalEarnings || 0)}
                        </span>
                        <p className="text-[11px] text-emerald-600 font-semibold">
                          +{formatPrice(user.adminCommissionGenerated || 0)} 5% cut
                        </p>
                      </div>
                    ) : user.role === "student" ? (
                      <div className="text-xs font-semibold text-foreground">
                        Spent: {formatPrice(user.totalSpent || 0)}
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-emerald-600">Platform Treasury</div>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`text-xs capitalize font-medium ${
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : user.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {user.joinDate}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 text-xs">
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user)}
                          className="cursor-pointer"
                        >
                          {user.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-3.5 w-3.5 text-amber-500" /> Suspend Account
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Activate Account
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase">
                          Change Role
                        </div>
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(user, "student")}
                          className="cursor-pointer"
                        >
                          Make Student
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(user, "instructor")}
                          className="cursor-pointer"
                        >
                          Make Instructor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(user, "admin")}
                          className="cursor-pointer"
                        >
                          Make Admin
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(user)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default AdminUsersPage;
