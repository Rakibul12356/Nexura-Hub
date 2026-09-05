import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  toggleCoursePublish,
  toggleCourseFeatured,
  deleteAdminCourse,
} from "@/store/slices/adminSlice";
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
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

export const AdminCoursesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { courses } = useAppSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const categories = useMemo(() => {
    return Array.from(new Set(courses.map((c) => c.category)));
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
        selectedCreator === "all" || course.creatorType === selectedCreator;

      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "published" && course.isPublished) ||
        (selectedStatus === "draft" && !course.isPublished);

      return matchSearch && matchCategory && matchCreator && matchStatus;
    });
  }, [courses, searchTerm, selectedCategory, selectedCreator, selectedStatus]);

  const handleTogglePublish = (id: string | number, current: boolean) => {
    dispatch(toggleCoursePublish(id));
    toast.success(current ? "Course moved to drafts" : "Course published to marketplace!");
  };

  const handleToggleFeatured = (id: string | number, current: boolean) => {
    dispatch(toggleCourseFeatured(id));
    toast.success(current ? "Removed from featured" : "Marked as featured on homepage!");
  };

  const handleDelete = (id: string | number, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      dispatch(deleteAdminCourse(id));
      toast.success("Course deleted successfully");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Full administrative access over all instructor and platform courses ({courses.length} total)
          </p>
        </div>

        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm gap-2">
          <Link to="/admin/courses/add">
            <PlusCircle className="h-4 w-4" />
            <span>Create Admin Course (100% Rev)</span>
          </Link>
        </Button>
      </div>

      {/* Commission Rules Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border text-xs">
        <div className="flex items-start gap-2.5">
          <div className="h-6 w-6 rounded bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
            <Percent className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-semibold text-foreground">Instructor Courses (5% Platform Fee):</span>
            <p className="text-muted-foreground mt-0.5">
              When an instructor course is sold, 95% goes to the instructor and 5% commission is automatically earned by the platform.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-semibold text-foreground">Admin-Created Courses (100% Revenue):</span>
            <p className="text-muted-foreground mt-0.5">
              Courses created directly by Admin retain 100% of the course sale price for the Nexura Hub platform.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {/* Creator filter */}
          <Select value={selectedCreator} onValueChange={setSelectedCreator}>
            <SelectTrigger className="h-9 w-36 text-xs">
              <SelectValue placeholder="Creator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Creators</SelectItem>
              <SelectItem value="instructor">Instructor Only</SelectItem>
              <SelectItem value="admin">Admin Only</SelectItem>
            </SelectContent>
          </Select>

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

          {/* Status filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 w-32 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft / Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-xs">
              <TableHead className="w-[300px]">Course Details</TableHead>
              <TableHead>Creator & Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sales & Rev</TableHead>
              <TableHead>Admin Cut</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No courses found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-12 w-20 rounded-md object-cover border shrink-0"
                      />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm line-clamp-1 hover:text-primary cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                          {course.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">
                            {course.category}
                          </span>
                          {course.isFeatured && (
                            <Badge variant="outline" className="text-[9px] text-amber-600 bg-amber-500/10 border-amber-500/30 gap-0.5 py-0 px-1">
                              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">
                        {course.instructor?.name || "Nexura Team"}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          course.creatorType === "admin"
                            ? "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300"
                            : "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                        }`}
                      >
                        {course.creatorType === "admin" ? "Admin (100% Rev)" : "Instructor (5% Fee)"}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-sm text-foreground">
                      {formatPrice(course.discountPrice || course.price)}
                    </div>
                    {course.discountPrice && (
                      <div className="text-[11px] text-muted-foreground line-through">
                        {formatPrice(course.price)}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-medium">{course.enrollmentsCount} students</div>
                    <div className="text-xs text-muted-foreground font-semibold">
                      {formatPrice(course.totalRevenue)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatPrice(course.adminEarnings)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {course.creatorType === "admin" ? "100% Platform" : "5% Commission"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`text-xs font-medium ${
                        course.isPublished
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft / Review"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 text-xs">
                        <DropdownMenuItem asChild>
                          <Link to={`/courses/${course.id}`} target="_blank" className="cursor-pointer">
                            <Eye className="mr-2 h-3.5 w-3.5" /> Preview Course
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/courses/${course.id}`} className="cursor-pointer">
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit Curriculum
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleFeatured(course.id, !!course.isFeatured)}
                          className="cursor-pointer"
                        >
                          <Star className="mr-2 h-3.5 w-3.5 text-amber-500" />
                          {course.isFeatured ? "Unfeature" : "Feature on Home"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTogglePublish(course.id, course.isPublished)}
                          className="cursor-pointer"
                        >
                          {course.isPublished ? (
                            <>
                              <XCircle className="mr-2 h-3.5 w-3.5 text-amber-500" /> Unpublish
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(course.id, course.title)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Course
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
