import React, { useState, useMemo } from "react";
import { formatPrice } from "@/lib/formatPrice";
import { ManagedUser } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ShieldCheck,
  UserX,
  UserCheck,
  GraduationCap,
  Users,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import { confirmDelete } from "@/lib/confirmDelete";
import { exportToCsv } from "@/lib/exportToCsv";

const initialManagedUsers: ManagedUser[] = [
  {
    id: 1,
    firstName: "Rahim",
    lastName: "Ahmed",
    email: "rahim@example.com",
    role: "student",
    status: "active",
    joinDate: "2024-01-10",
    enrolledCoursesCount: 3,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  },
  {
    id: 101,
    firstName: "Tapas",
    lastName: "Adhikary",
    email: "tapas@nexurahub.com",
    role: "instructor",
    status: "active",
    joinDate: "2023-11-05",
    totalEarnings: 85000,
    createdCoursesCount: 4,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  },
];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>(initialManagedUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleTab, setSelectedRoleTab] = useState("all");

  const handleExportUsersCsv = () => {
    exportToCsv("Nexura_Platform_Users.csv", users);
    toast.success("Users list exported to CSV!");
  };

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
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    toast.success(
      `User ${user.firstName} ${user.lastName} has been ${
        nextStatus === "active" ? "activated" : "suspended"
      }`
    );
  };

  const handleChangeRole = (user: ManagedUser, newRole: ManagedUser["role"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
    );
    toast.success(`Role for ${user.firstName} changed to ${newRole}`);
  };

  const handleDelete = async (user: ManagedUser) => {
    const ok = await confirmDelete(
      `Are you sure you want to remove user ${user.firstName} ${user.lastName}?`
    );
    if (ok) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("User account removed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage student accounts, instructors, role permissions, and access status.
          </p>
        </div>

        <Button variant="outline" onClick={handleExportUsersCsv}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Role Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-sky-500/10 text-sky-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Students</p>
            <h3 className="text-xl font-bold">{students.length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Instructors</p>
            <h3 className="text-xl font-bold">{instructors.length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Admins</p>
            <h3 className="text-xl font-bold">{admins.length}</h3>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Tabs value={selectedRoleTab} onValueChange={setSelectedRoleTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="all" className="text-xs">All ({users.length})</TabsTrigger>
            <TabsTrigger value="student" className="text-xs">Students</TabsTrigger>
            <TabsTrigger value="instructor" className="text-xs">Instructors</TabsTrigger>
            <TabsTrigger value="admin" className="text-xs">Admins</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Profile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Activity Stats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        user.role === "admin"
                          ? "border-amber-500 text-amber-600 bg-amber-500/10"
                          : user.role === "instructor"
                          ? "border-purple-500 text-purple-600 bg-purple-500/10"
                          : "border-sky-500 text-sky-600 bg-sky-500/10"
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "destructive"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{user.joinDate}</TableCell>
                  <TableCell className="text-xs">
                    {user.role === "instructor" ? (
                      <div>
                        <p className="font-medium text-purple-600">{user.createdCoursesCount || 0} Courses</p>
                        <p className="text-[10px] text-muted-foreground">{formatPrice(user.totalEarnings || 0)} Earned</p>
                      </div>
                    ) : (
                      <p className="font-medium text-sky-600">{user.enrolledCoursesCount || 0} Enrolled</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          {user.status === "active" ? (
                            <>
                              <UserX className="h-4 w-4 mr-2 text-destructive" /> Suspend Access
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2 text-emerald-600" /> Activate Account
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleChangeRole(user, "student")}>
                          Make Student
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(user, "instructor")}>
                          Make Instructor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(user, "admin")}>
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(user)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Account
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
