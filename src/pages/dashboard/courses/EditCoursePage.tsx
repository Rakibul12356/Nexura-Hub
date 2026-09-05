import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IconBadge } from "@/components/common/icon-badge";
import { AlertBanner } from "@/components/common/alert-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "@/components/common/file-upload";
import { ModuleList } from "@/components/dashboard/courses/ModuleList";
import { formatPrice } from "@/lib/formatPrice";
import {
  LayoutDashboard,
  ListChecks,
  CircleDollarSign,
  Pencil,
  PlusCircle,
  Trash2,
  BookA,
  GraduationCap,
  Star,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCourse, deleteCourse } from "@/store/slices/dashboardSlice";
import { toast } from "react-toastify";
import { Module } from "@/types/course";

export const EditCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { instructorCourses, quizSets } = useAppSelector((state) => state.dashboard);
  const { categories } = useAppSelector((state) => state.courses);

  const course =
    instructorCourses.find((c) => String(c.id) === String(courseId)) ||
    instructorCourses[0];

  // Forms editing states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(course?.title || "");

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(course?.description || "");

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [thumbnail, setThumbnail] = useState(course?.thumbnail || "");

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [category, setCategory] = useState(course?.category || "Development");

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [price, setPrice] = useState(course?.price || 49);

  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const [modules, setModules] = useState<Module[]>(
    course?.modules && course.modules.length > 0
      ? course.modules
      : [
          {
            id: "mod-1",
            title: "Introduction to React Ecosystem",
            isPublished: true,
            position: 1,
            lessons: [],
          },
          {
            id: "mod-2",
            title: "State Architecture with Redux Toolkit",
            isPublished: true,
            position: 2,
            lessons: [],
          },
        ]
  );

  const [isPublished, setIsPublished] = useState(course?.isPublished || false);

  const handleTogglePublish = () => {
    const nextState = !isPublished;
    setIsPublished(nextState);
    dispatch(updateCourse({ ...course, isPublished: nextState }));
    toast.success(
      nextState ? "Course published successfully!" : "Course moved to draft."
    );
  };

  const handleDeleteCourse = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(course.id));
      toast.success("Course deleted successfully");
      navigate("/dashboard/courses");
    }
  };

  const handleSaveTitle = () => {
    dispatch(updateCourse({ ...course, title }));
    setIsEditingTitle(false);
    toast.success("Title updated");
  };

  const handleSaveDesc = () => {
    dispatch(updateCourse({ ...course, description, subtitle: description }));
    setIsEditingDesc(false);
    toast.success("Description updated");
  };

  const handleSaveCategory = (val: string) => {
    setCategory(val);
    dispatch(updateCourse({ ...course, category: val }));
    setIsEditingCategory(false);
    toast.success("Category updated");
  };

  const handleSavePrice = () => {
    dispatch(updateCourse({ ...course, price: Number(price) }));
    setIsEditingPrice(false);
    toast.success("Price updated");
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    const newMod: Module = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle,
      isPublished: true,
      position: modules.length + 1,
      lessons: [],
    };
    const updated = [...modules, newMod];
    setModules(updated);
    dispatch(updateCourse({ ...course, modules: updated }));
    setNewModuleTitle("");
    setIsCreatingModule(false);
    toast.success("Module added");
  };

  const handleReorderModules = (
    updateData: { id: string | number; position: number }[]
  ) => {
    toast.success("Modules reordered");
  };

  return (
    <>
      {!isPublished && (
        <AlertBanner
          label="This course is unpublished. It will not be visible in the catalog to students."
          variant="warning"
        />
      )}

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Back and Top Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/dashboard/courses"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={`/dashboard/courses/${course.id}/enrollments`} className="gap-1.5">
                <GraduationCap className="h-4 w-4 text-sky-600" />
                Enrollments
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={`/dashboard/courses/${course.id}/reviews`} className="gap-1.5">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                Reviews
              </Link>
            </Button>
            <Button
              onClick={handleTogglePublish}
              size="sm"
              className={isPublished ? "bg-slate-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button
              onClick={handleDeleteCourse}
              variant="destructive"
              size="sm"
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 2-Column Course Setup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Column 1: Customize your course */}
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-bold">Customize your course</h2>
            </div>

            {/* Title Form */}
            <div className="border bg-card rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course Title</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(!isEditingTitle)}
                  className="gap-1 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {isEditingTitle ? "Cancel" : "Edit"}
                </Button>
              </div>

              {!isEditingTitle ? (
                <p className="text-sm text-foreground mt-2 font-semibold">
                  {course.title}
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Button size="sm" onClick={handleSaveTitle}>
                    Save Title
                  </Button>
                </div>
              )}
            </div>

            {/* Description Form */}
            <div className="border bg-card rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course Description</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingDesc(!isEditingDesc)}
                  className="gap-1 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {isEditingDesc ? "Cancel" : "Edit"}
                </Button>
              </div>

              {!isEditingDesc ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {course.description || "No description provided."}
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                  <Button size="sm" onClick={handleSaveDesc}>
                    Save Description
                  </Button>
                </div>
              )}
            </div>

            {/* Image Form */}
            <div className="border bg-card rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course Thumbnail Image</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingImage(!isEditingImage)}
                  className="gap-1 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {isEditingImage ? "Cancel" : "Edit"}
                </Button>
              </div>

              {!isEditingImage ? (
                <div className="mt-3 relative aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={thumbnail || course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-3">
                  <UploadDropzone
                    value={thumbnail}
                    onChange={(url) => {
                      setThumbnail(url);
                      dispatch(updateCourse({ ...course, thumbnail: url }));
                      setIsEditingImage(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category Form */}
            <div className="border bg-card rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course Category</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingCategory(!isEditingCategory)}
                  className="gap-1 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {isEditingCategory ? "Cancel" : "Edit"}
                </Button>
              </div>

              {!isEditingCategory ? (
                <p className="text-sm text-foreground mt-2 font-medium">
                  {course.category}
                </p>
              ) : (
                <div className="mt-3">
                  <Select
                    defaultValue={category}
                    onValueChange={handleSaveCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.title}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Course Modules & Pricing */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl font-bold">Course Modules</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreatingModule(!isCreatingModule)}
                  className="gap-1 text-xs text-sky-600 hover:text-sky-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  {isCreatingModule ? "Cancel" : "Add Module"}
                </Button>
              </div>

              <div className="border bg-card rounded-xl p-4 shadow-sm space-y-4">
                {isCreatingModule && (
                  <form onSubmit={handleAddModule} className="space-y-3 pb-3 border-b">
                    <Input
                      placeholder="e.g. 'Advanced React Patterns'"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      required
                    />
                    <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-700">
                      Create Module
                    </Button>
                  </form>
                )}

                <ModuleList
                  items={modules}
                  onReorder={handleReorderModules}
                  onEdit={(moduleId) =>
                    navigate(`/dashboard/courses/${course.id}/modules/${moduleId}`)
                  }
                />

                <p className="text-xs text-muted-foreground text-center">
                  Drag and drop to reorder course modules
                </p>
              </div>
            </div>

            {/* Price Form */}
            <div>
              <div className="flex items-center gap-x-2 mb-4">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl font-bold">Sell Your Course</h2>
              </div>

              <div className="border bg-card rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between font-medium text-sm">
                  <span>Course Price</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingPrice(!isEditingPrice)}
                    className="gap-1 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {isEditingPrice ? "Cancel" : "Edit"}
                  </Button>
                </div>

                {!isEditingPrice ? (
                  <p className="text-xl font-bold text-foreground mt-2">
                    {formatPrice(course.price)}
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    <Input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <Button size="sm" onClick={handleSavePrice}>
                      Save Price
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCoursePage;
