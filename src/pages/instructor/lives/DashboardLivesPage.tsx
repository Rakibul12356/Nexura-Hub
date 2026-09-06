import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Radio,
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { deleteLiveClass } from "@/store/slices/dashboardSlice";
import { toast } from "react-toastify";

export const DashboardLivesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { liveClasses } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = liveClasses.filter(
    (l) =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this live class?")) {
      dispatch(deleteLiveClass(id));
      toast.success("Live class deleted");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Radio className="h-6 w-6 text-rose-500 animate-pulse" />
            Live Classes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schedule, manage, and host live interactive video sessions
          </p>
        </div>

        <Button asChild className="bg-sky-600 hover:bg-sky-700 gap-1.5 shadow">
          <Link to="/dashboard/lives/add">
            <PlusCircle className="h-4 w-4" />
            Schedule Live Class
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search live sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic / Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Meeting Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold text-foreground">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.time}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.meetingLink ? (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:underline flex items-center gap-1 text-xs font-medium"
                      >
                        Join URL <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not set</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to={`/dashboard/lives/${item.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Session
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Session
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No live sessions scheduled.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardLivesPage;
