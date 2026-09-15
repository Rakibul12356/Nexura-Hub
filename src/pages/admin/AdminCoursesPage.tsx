import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { toast } from "react-toastify";
import { confirmDelete } from "@/lib/confirmDelete";
import {
  useCoursesQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/hooks/queries/useCoursesQuery";

export const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useCoursesQuery();
  const updateCourseMutation = useUpdateCourseMutation();
  const deleteCourseMutation = useDeleteCourseMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const categories = useMemo(() => {
    const list = courses
      .map((c) => c.category)
      .filter((cat): cat is string => Boolean(cat));
    return Array.from(new Set(list));
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructor?.name &&
          course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === "all" || course.category === selectedCategory;

      const matchCreator =
        selectedCreator === "all" || (course as any).creatorType === selectedCreator;

      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "published" && course.isPublished) ||
        (selectedStatus === "draft" && !course.isPublished);

      return matchSearch && matchCategory && matchCreator && matchStatus;
    });
  }, [courses, searchTerm, selectedCategory, selectedCreator, selectedStatus]);

  const handleTogglePublish = (id: string | number, current: boolean) => {
    updateCourseMutation.mutate(
      { id, data: { isPublished: !current } },
      {
        onSuccess: () => {
          toast.success(current ? "Course moved to drafts" : "Course published to marketplace!");
        },
      }
    );
  };

  const handleToggleFeatured = (id: string | number, current: boolean) => {
    updateCourseMutation.mutate(
      { id, data: { isFeatured: !current } },
      {
        onSuccess: () => {
          toast.success(current ? "Removed from featured" : "Marked as featured on homepage!");
        },
      }
    );
  };

  const handleDelete = async (id: string | number, title: string) => {
    const ok = await confirmDelete(`Are you sure you want to permanently delete "${title}"?`);
    if (ok) {
      deleteCourseMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage, approve, feature, and edit all platform courses.
          </p>
        </div>

        <Button onClick={() => navigate("/dashboard/courses/add")} className="bg-sky-600 hover:bg-sky-700">
          <PlusCircle className="h-4 w-4 mr-2" /> Create Course
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Category filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="h-9 w-36 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Creator filter */}
        <Select value={selectedCreator} onValueChange={setSelectedCreator}>
          <SelectTrigger className="h-9 w-32 text-xs">
            <SelectValue placeholder="Creator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Creators</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="h-9 w-32 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading courses...
                </TableCell>
              </TableRow>
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80"}
                        alt={course.title}
                        className="h-10 w-14 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold text-sm line-clamp-1">{course.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {course.isFeatured && (
                            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600 gap-1 px-1.5 py-0">
                              <Star className="h-2.5 w-2.5 fill-amber-500" /> Featured
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {(course as any).creatorType === "admin" ? (
                              <Badge variant="outline" className="text-[10px] px-1 py-0 border-sky-500 text-sky-600">
                                <ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> Admin
                              </Badge>
                            ) : (
                              "Instructor"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {course.instructor?.name || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-xs">{course.category || "Uncategorized"}</TableCell>
                  <TableCell className="text-xs font-semibold">
                    {formatPrice(course.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.isPublished ? "default" : "secondary"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}`)}>
                          <Eye className="h-4 w-4 mr-2" /> View Course
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/courses/${course.id}/edit`)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleTogglePublish(course.id, course.isPublished)}>
                          {course.isPublished ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2 text-amber-600" /> Unpublish
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(course.id, course.isFeatured)}>
                          <Star className="h-4 w-4 mr-2 text-amber-500" />
                          {course.isFeatured ? "Unfeature" : "Make Featured"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(course.id, course.title)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
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

export default AdminCoursesPage;
