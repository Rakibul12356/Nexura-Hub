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
  BookA,
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { deleteQuizSet } from "@/store/slices/dashboardSlice";
import { toast } from "react-toastify";
import { confirmDelete } from "@/lib/confirmDelete";

export const DashboardQuizSetsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { quizSets } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = quizSets.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string | number) => {
    const ok = await confirmDelete("Are you sure you want to delete this quiz set?");
    if (ok) {
      dispatch(deleteQuizSet(id));
      toast.success("Quiz set deleted");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookA className="h-6 w-6 text-indigo-500" />
            Quiz Sets
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Build and attach interactive multiple-choice question assessments
          </p>
        </div>

        <Button asChild className="bg-sky-600 hover:bg-sky-700 gap-1.5 shadow">
          <Link to="/dashboard/quiz-sets/add">
            <PlusCircle className="h-4 w-4" />
            New Quiz Set
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quiz sets..."
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
              <TableHead>Quiz Set Title</TableHead>
              <TableHead>Total Questions</TableHead>
              <TableHead>Total Marks</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell className="text-muted-foreground">
                    {item.questions?.length || 0} Questions
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.totalMarks || 20} Marks</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isPublished ? "success" : "secondary"}>
                      {item.isPublished ? "Published" : "Draft"}
                    </Badge>
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
                          <Link to={`/dashboard/quiz-sets/${item.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Questions
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Quiz Set
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No quiz sets created yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardQuizSetsPage;
