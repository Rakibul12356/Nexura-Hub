import React, { useState, useEffect } from "react";
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
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { Module } from "@/types/course";
import { confirmDelete } from "@/lib/confirmDelete";
import {
  useCourseDetailQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useCategoriesQuery,
} from "@/hooks/queries/useCoursesQuery";

export const EditCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetailQuery(courseId || "");
  const { data: categories = [] } = useCategoriesQuery();
  const updateCourseMutation = useUpdateCourseMutation();
  const deleteCourseMutation = useDeleteCourseMutation();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("");

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [image, setImage] = useState("");

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [category, setCategory] = useState("");

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [price, setPrice] = useState<number>(0);

  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (course) {
      setTitle(course.title || "");
      setDescription(course.description || "");
      setImage(course.thumbnail || course.image || "");
      setCategory(course.category || "");
      setPrice(course.price || 0);
      setModules(course.modules || []);
    }
  }, [course]);

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Loading course details...</div>;
  }

  if (!course) {
    return <div className="p-6 text-center text-muted-foreground">Course not found.</div>;
  }

  const isPublished = course.isPublished;
  const completionText = `${[title, description, image, category, price, modules.length > 0].filter(Boolean).length}/6 completed`;

  const handleUpdate = (updatedFields: Partial<typeof course>) => {
    if (!courseId) return;
    updateCourseMutation.mutate({ id: courseId, data: updatedFields });
  };

  const handleTogglePublish = () => {
    handleUpdate({ isPublished: !isPublished });
  };

  const handleDeleteCourse = async () => {
    if (!courseId) return;
    const ok = await confirmDelete(`Are you sure you want to delete "${course.title}"?`);
    if (ok) {
      deleteCourseMutation.mutate(courseId, {
        onSuccess: () => {
          navigate("/dashboard/courses");
        },
      });
    }
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle.trim(),
      position: modules.length + 1,
      isPublished: false,
      lessons: [],
    };

    const updatedModules = [...modules, newModule];
    setModules(updatedModules);
    handleUpdate({ modules: updatedModules });
    setNewModuleTitle("");
    setIsCreatingModule(false);
    toast.success("Module created!");
  };

  const handleReorderModules = (updateData: { id: string | number; position: number }[]) => {
    const updated = [...modules].sort((a, b) => {
      const posA = updateData.find((u) => u.id === a.id)?.position || a.position || 0;
      const posB = updateData.find((u) => u.id === b.id)?.position || b.position || 0;
      return posA - posB;
    });
    setModules(updated);
    handleUpdate({ modules: updated });
  };

  return (
    <div className="p-6 space-y-6">
      <Link to="/dashboard/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to courses
      </Link>

      {!isPublished && (
        <AlertBanner label="This course is unpublished. It will not be visible in the marketplace." variant="warning" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Course Setup</h1>
          <span className="text-xs text-muted-foreground">Complete all fields {completionText}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleTogglePublish}>
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="destructive" size="icon" className="h-9 w-9" onClick={handleDeleteCourse}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Course Details */}
        <div className="space-y-6">
          <div className="p-5 border rounded-xl bg-card space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <IconBadge icon={LayoutDashboard} />
              <h3>Customize your course</h3>
            </div>

            {/* Title */}
            <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course title</span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingTitle(!isEditingTitle)}>
                  {isEditingTitle ? "Cancel" : <><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</>}
                </Button>
              </div>
              {isEditingTitle ? (
                <div className="space-y-2">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  <Button size="sm" onClick={() => { handleUpdate({ title }); setIsEditingTitle(false); }}>
                    Save
                  </Button>
                </div>
              ) : (
                <p className="text-sm font-semibold">{title}</p>
              )}
            </div>

            {/* Description */}
            <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course description</span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingDescription(!isEditingDescription)}>
                  {isEditingDescription ? "Cancel" : <><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</>}
                </Button>
              </div>
              {isEditingDescription ? (
                <div className="space-y-2">
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                  <Button size="sm" onClick={() => { handleUpdate({ description }); setIsEditingDescription(false); }}>
                    Save
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">{description || "No description provided."}</p>
              )}
            </div>

            {/* Image */}
            <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course image</span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingImage(!isEditingImage)}>
                  {isEditingImage ? "Cancel" : <><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</>}
                </Button>
              </div>
              {isEditingImage ? (
                <UploadDropzone
                  endpoint="courseImage"
                  onChange={(url) => {
                    if (url) {
                      setImage(url);
                      handleUpdate({ thumbnail: url });
                      setIsEditingImage(false);
                    }
                  }}
                />
              ) : image ? (
                <img src={image} alt="Course" className="h-40 w-full object-cover rounded-md border" />
              ) : (
                <div className="h-40 w-full border border-dashed rounded-md flex items-center justify-center text-xs text-muted-foreground">
                  No thumbnail uploaded
                </div>
              )}
            </div>

            {/* Category */}
            <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course category</span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingCategory(!isEditingCategory)}>
                  {isEditingCategory ? "Cancel" : <><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</>}
                </Button>
              </div>
              {isEditingCategory ? (
                <div className="space-y-2">
                  <Select value={category} onValueChange={(val) => setCategory(val)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => { handleUpdate({ category }); setIsEditingCategory(false); }}>
                    Save
                  </Button>
                </div>
              ) : (
                <p className="text-xs font-medium">{category || "No category selected."}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Modules & Pricing */}
        <div className="space-y-6">
          {/* Modules */}
          <div className="p-5 border rounded-xl bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <IconBadge icon={ListChecks} />
                <h3>Course Modules</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsCreatingModule(!isCreatingModule)}>
                {isCreatingModule ? "Cancel" : <><PlusCircle className="h-3.5 w-3.5 mr-1" /> Add Module</>}
              </Button>
            </div>

            {isCreatingModule && (
              <form onSubmit={handleAddModule} className="flex gap-2">
                <Input
                  placeholder="e.g. 'Introduction to the course'"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  className="text-xs h-9"
                />
                <Button size="sm" type="submit" className="h-9">Create</Button>
              </form>
            )}

            <ModuleList
              onEdit={(id) => navigate(`/dashboard/courses/${courseId}/modules/${id}`)}
              onReorder={handleReorderModules}
              items={modules}
            />
          </div>

          {/* Pricing */}
          <div className="p-5 border rounded-xl bg-card space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <IconBadge icon={CircleDollarSign} />
              <h3>Sell your course</h3>
            </div>

            <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
              <div className="flex items-center justify-between font-medium text-sm">
                <span>Course price</span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingPrice(!isEditingPrice)}>
                  {isEditingPrice ? "Cancel" : <><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</>}
                </Button>
              </div>
              {isEditingPrice ? (
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="text-xs"
                  />
                  <Button size="sm" onClick={() => { handleUpdate({ price }); setIsEditingPrice(false); }}>
                    Save Price
                  </Button>
                </div>
              ) : (
                <p className="text-sm font-semibold">{formatPrice(price)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
