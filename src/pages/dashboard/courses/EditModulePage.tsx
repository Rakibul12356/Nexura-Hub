import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IconBadge } from "@/components/common/icon-badge";
import { AlertBanner } from "@/components/common/alert-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  ArrowLeft,
  BookOpenCheck,
  LayoutDashboard,
  Pencil,
  PlusCircle,
  Grip,
  PlayCircle,
  Video,
  FileText,
  HelpCircle,
  Download,
  Trash2,
  Paperclip,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";
import { Lesson, LessonResource } from "@/types/course";
import { cn } from "@/lib/utils";

export const EditModulePage: React.FC = () => {
  const { courseId = "1", moduleId = "1" } = useParams();
  const navigate = useNavigate();
  const { quizSets } = useAppSelector((state) => state.dashboard);

  const [moduleTitle, setModuleTitle] = useState("Introduction to React Ecosystem");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "les-1",
      title: "Course Overview & Learning Objectives",
      description: "Getting set up with modern workspace tools, Vite, TypeScript and full-stack component lifecycle.",
      videoUrl: "https://www.youtube.com/embed/666K4aizIu8",
      isFree: true,
      isPublished: true,
      position: 1,
      quizSetId: "quiz-1",
      quizSetTitle: "React Fundamentals Assessment",
      resources: [
        { id: "res-1", title: "lecture-01-starter-code.zip", size: "2.4 MB", url: "https://github.com" },
        { id: "res-2", title: "react-architecture-cheatsheet.pdf", size: "1.1 MB", url: "https://react.dev" },
      ],
    },
    {
      id: "les-2",
      title: "What is React & Virtual DOM?",
      description: "Core diffing algorithms, synthetic events and declarative UI paradigms.",
      videoUrl: "https://www.youtube.com/embed/666K4aizIu8",
      isFree: true,
      isPublished: true,
      position: 2,
      quizSetId: "quiz-1",
      quizSetTitle: "Virtual DOM Quiz",
      resources: [
        { id: "res-3", title: "virtual-dom-diagram.png", size: "650 KB", url: "https://react.dev" },
      ],
    },
    {
      id: "les-3",
      title: "Components, State & Props",
      description: "Managing local state with hooks, immutable update patterns and passing callbacks.",
      videoUrl: "https://www.youtube.com/embed/666K4aizIu8",
      isFree: false,
      isPublished: true,
      position: 3,
      resources: [],
    },
  ]);

  const [selectedLessonId, setSelectedLessonId] = useState<string | number>("les-1");
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  // New Resource form states
  const [newResTitle, setNewResTitle] = useState("");
  const [newResSize, setNewResSize] = useState("");
  const [newResUrl, setNewResUrl] = useState("");

  const activeLesson =
    lessons.find((l) => String(l.id) === String(selectedLessonId)) || lessons[0];

  const handleUpdateActiveLesson = (updated: Partial<Lesson>) => {
    if (!activeLesson) return;
    setLessons(
      lessons.map((l) =>
        String(l.id) === String(activeLesson.id) ? { ...l, ...updated } : l
      )
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(lessons);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setLessons(items);
    toast.success("Lessons reordered");
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: newLessonTitle,
      description: "Write a detailed overview of this lesson...",
      videoUrl: "https://www.youtube.com/embed/666K4aizIu8",
      isFree: false,
      isPublished: true,
      position: lessons.length + 1,
      resources: [],
    };
    setLessons([...lessons, newLesson]);
    setSelectedLessonId(newLesson.id);
    setNewLessonTitle("");
    setIsAddingLesson(false);
    toast.success("Lesson added & selected!");
  };

  const handleDeleteLesson = (lessonId: string | number) => {
    const updated = lessons.filter((l) => String(l.id) !== String(lessonId));
    setLessons(updated);
    if (updated.length > 0) {
      setSelectedLessonId(updated[0].id);
    }
    toast.success("Lesson deleted");
  };

  const handleAddResourceToActiveLesson = () => {
    if (!newResTitle.trim() || !activeLesson) return;
    const newRes: LessonResource = {
      id: `res-${Date.now()}`,
      title: newResTitle,
      size: newResSize || "1.5 MB",
      url: newResUrl || "https://github.com",
    };
    const updatedResources = [...(activeLesson.resources || []), newRes];
    handleUpdateActiveLesson({ resources: updatedResources });
    setNewResTitle("");
    setNewResSize("");
    setNewResUrl("");
    toast.success("Resource attachment added");
  };

  const handleDeleteResourceFromActiveLesson = (resId: string | number) => {
    if (!activeLesson) return;
    const updatedResources = (activeLesson.resources || []).filter(
      (r) => r.id !== resId
    );
    handleUpdateActiveLesson({ resources: updatedResources });
    toast.success("Resource removed");
  };

  return (
    <>
      {!isPublished && (
        <AlertBanner
          label="This module is unpublished. It will not be visible in the course catalog."
          variant="warning"
        />
      )}

      <div className="p-6 space-y-6 w-full">
        {/* Top Header & Actions */}
        <div className="flex items-center justify-between">
          <Link
            to={`/dashboard/courses/${courseId}`}
            className="flex items-center text-sm hover:text-sky-600 transition-colors gap-1.5 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course Setup
          </Link>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setIsPublished(!isPublished);
                toast.success(
                  !isPublished ? "Module published" : "Module moved to draft"
                );
              }}
              size="sm"
              className={
                isPublished
                  ? "bg-slate-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this module?")) {
                  toast.success("Module deleted successfully");
                  navigate(`/dashboard/courses/${courseId}`);
                }
              }}
              size="sm"
              variant="destructive"
              title="Delete Module"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Grid: Left Side = Selected Lesson Content Viewer/Editor | Right Side = Module Title & Lessons List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left Column (Span 8): Selected Lesson Content Viewer & Inspector */}
          <div className="lg:col-span-8 space-y-6">
            {activeLesson ? (
              <div className="border bg-card rounded-2xl p-6 shadow-sm space-y-6">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <IconBadge icon={Video} size="sm" />
                      <h2 className="text-xl font-bold tracking-tight">
                        {activeLesson.title}
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lesson #{activeLesson.position || 1} in {moduleTitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeLesson.isFree ? (
                      <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30">
                        Free Preview
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Paid Content
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Video Player Box */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <PlayCircle className="h-4 w-4 text-sky-600" /> Lesson Video Preview
                  </span>
                  {activeLesson.videoUrl ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border bg-black shadow-md min-h-[360px] sm:min-h-[420px] md:min-h-[460px]">
                      <iframe
                        src={activeLesson.videoUrl}
                        title={activeLesson.title}
                        className="w-full h-full border-0 min-h-[360px] sm:min-h-[420px] md:min-h-[460px]"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video min-h-[300px] sm:min-h-[360px] rounded-2xl border border-dashed flex flex-col items-center justify-center text-center p-6 bg-muted/30">
                      <Video className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm font-semibold">No Video Attached</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Add a YouTube or MP4 video URL below to preview the stream.
                      </p>
                    </div>
                  )}
                </div>

                {/* Tabbed Inspector & Editor */}
                <Tabs defaultValue="details" className="w-full pt-2">
                  <TabsList className="grid grid-cols-4 w-full bg-muted/60 p-1 rounded-xl">
                    <TabsTrigger value="details" className="text-xs rounded-lg">
                      Video & Title
                    </TabsTrigger>
                    <TabsTrigger value="description" className="text-xs rounded-lg">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="text-xs rounded-lg">
                      Quiz
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="text-xs rounded-lg">
                      Resources ({activeLesson.resources?.length || 0})
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Video & Details Form */}
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          Lesson Title
                        </label>
                        <Input
                          value={activeLesson.title}
                          onChange={(e) =>
                            handleUpdateActiveLesson({ title: e.target.value })
                          }
                          placeholder="e.g. 'Introduction to React Hooks'"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          Video Stream URL
                        </label>
                        <Input
                          value={activeLesson.videoUrl || ""}
                          onChange={(e) =>
                            handleUpdateActiveLesson({ videoUrl: e.target.value })
                          }
                          placeholder="https://www.youtube.com/embed/..."
                        />
                      </div>

                      <div className="flex items-center space-x-2 border p-3 rounded-xl bg-muted/20">
                        <Checkbox
                          id="isFreePreview"
                          checked={activeLesson.isFree || false}
                          onCheckedChange={(checked) =>
                            handleUpdateActiveLesson({ isFree: Boolean(checked) })
                          }
                        />
                        <label htmlFor="isFreePreview" className="text-xs font-medium cursor-pointer">
                          Make this lesson available for Free Preview (Students can view without buying)
                        </label>
                      </div>

                      <Button
                        size="sm"
                        className="bg-sky-600 hover:bg-sky-700 text-white gap-1.5"
                        onClick={() => toast.success("Lesson details saved")}
                      >
                        <Save className="h-4 w-4" /> Save Details
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Tab 2: Lesson Description */}
                  <TabsContent value="description" className="space-y-3 pt-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1">
                        Lesson Overview & Syllabus Description
                      </label>
                      <Textarea
                        rows={5}
                        value={activeLesson.description || ""}
                        onChange={(e) =>
                          handleUpdateActiveLesson({ description: e.target.value })
                        }
                        placeholder="Explain what students will learn in this lesson..."
                      />
                    </div>
                    <Button
                      size="sm"
                      className="bg-sky-600 hover:bg-sky-700 text-white gap-1.5"
                      onClick={() => toast.success("Lesson description saved")}
                    >
                      <Save className="h-4 w-4" /> Save Description
                    </Button>
                  </TabsContent>

                  {/* Tab 3: Attached Quiz */}
                  <TabsContent value="quiz" className="space-y-4 pt-4">
                    <div className="border rounded-xl p-4 bg-muted/20 space-y-3">
                      <label className="text-xs font-semibold block">
                        Attach Quiz Set to this Lesson
                      </label>
                      <Select
                        value={activeLesson.quizSetId || "none"}
                        onValueChange={(val) => {
                          if (val === "none") {
                            handleUpdateActiveLesson({
                              quizSetId: undefined,
                              quizSetTitle: undefined,
                            });
                            toast.info("Quiz detached");
                          } else {
                            const found = quizSets.find((q) => String(q.id) === String(val));
                            handleUpdateActiveLesson({
                              quizSetId: val,
                              quizSetTitle: found?.title || "Attached Quiz",
                            });
                            toast.success(`Attached quiz: ${found?.title}`);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Quiz Set" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- No Quiz Attached --</SelectItem>
                          {quizSets.map((q) => (
                            <SelectItem key={q.id} value={String(q.id)}>
                              {q.title} ({q.questions?.length || 0} Questions)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {activeLesson.quizSetTitle && (
                        <div className="p-3 rounded-lg border bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-indigo-600" />
                            <span className="font-semibold text-indigo-900 dark:text-indigo-200">
                              {activeLesson.quizSetTitle}
                            </span>
                          </div>
                          <Badge variant="outline" className="border-indigo-400 text-indigo-600">
                            Attached
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Tab 4: Downloadable Resources */}
                  <TabsContent value="resources" className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <div className="border rounded-xl p-4 bg-muted/20 space-y-3">
                        <span className="text-xs font-bold block">
                          Add New Downloadable Resource File
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input
                            placeholder="Resource File Title (e.g. starter-code.zip)"
                            value={newResTitle}
                            onChange={(e) => setNewResTitle(e.target.value)}
                            className="text-xs"
                          />
                          <Input
                            placeholder="File Size (e.g. 2.4 MB)"
                            value={newResSize}
                            onChange={(e) => setNewResSize(e.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <Input
                          placeholder="Download URL (e.g. https://...)"
                          value={newResUrl}
                          onChange={(e) => setNewResUrl(e.target.value)}
                          className="text-xs"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddResourceToActiveLesson}
                          className="bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1"
                        >
                          <PlusCircle className="h-3.5 w-3.5" /> Attach Resource
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {activeLesson.resources && activeLesson.resources.length > 0 ? (
                          activeLesson.resources.map((res) => (
                            <div
                              key={res.id}
                              className="flex items-center justify-between p-3 rounded-xl border bg-card text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="h-4 w-4 text-sky-600 shrink-0" />
                                <span className="font-semibold truncate">{res.title}</span>
                                <Badge variant="secondary" className="text-[10px]">
                                  {res.size}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-600 hover:underline flex items-center gap-1 text-[11px]"
                                >
                                  <Download className="h-3.5 w-3.5" /> Open
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteResourceFromActiveLesson(res.id)}
                                  className="text-destructive hover:opacity-80 p-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-4">
                            No resources attached to this lesson yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="border bg-card rounded-2xl p-8 text-center text-muted-foreground space-y-2">
                <BookOpenCheck className="h-10 w-10 mx-auto text-muted-foreground/60" />
                <p className="font-semibold">No Lesson Selected</p>
                <p className="text-xs">
                  Select a lesson from the right panel list to inspect and edit its content.
                </p>
              </div>
            )}
          </div>

          {/* Right Column (Span 4): Module Title & Module Lessons List */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customize Module Title Card */}
            <div className="space-y-3">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl font-bold">Customize Your Module</h2>
              </div>

              <div className="border bg-card rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between font-medium text-sm">
                  <span>Module Title</span>
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
                  <p className="text-base font-semibold text-foreground">{moduleTitle}</p>
                ) : (
                  <div className="space-y-3 pt-1">
                    <Input
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                    />
                    <Button
                      size="sm"
                      className="bg-sky-600 hover:bg-sky-700 text-white"
                      onClick={() => {
                        setIsEditingTitle(false);
                        toast.success("Module title updated");
                      }}
                    >
                      Save Title
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Module Lessons List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={BookOpenCheck} />
                  <h2 className="text-xl font-bold">Module Lessons</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingLesson(!isAddingLesson)}
                  className="gap-1 text-xs text-sky-600 hover:text-sky-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  {isAddingLesson ? "Cancel" : "Add Lesson"}
                </Button>
              </div>

              <div className="border bg-card rounded-2xl p-4 shadow-sm space-y-4">
                {isAddingLesson && (
                  <form onSubmit={handleAddLesson} className="space-y-3 pb-3 border-b">
                    <Input
                      placeholder="e.g. 'Component Lifecycle in Depth'"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      required
                    />
                    <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-700 text-white">
                      Create Lesson
                    </Button>
                  </form>
                )}

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="lessons">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2.5">
                        {lessons.map((lesson, index) => {
                          const isSelected = String(lesson.id) === String(selectedLessonId);
                          return (
                            <Draggable
                              key={String(lesson.id)}
                              draggableId={String(lesson.id)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  onClick={() => setSelectedLessonId(lesson.id)}
                                  className={cn(
                                    "flex items-center gap-x-2 bg-muted/50 border rounded-xl text-sm overflow-hidden transition-all cursor-pointer hover:border-sky-400 select-none",
                                    isSelected &&
                                      "border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 ring-1 ring-sky-500 shadow-sm"
                                  )}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-3 py-3.5 border-r hover:bg-muted cursor-grab active:cursor-grabbing shrink-0"
                                  >
                                    <Grip className="h-4 w-4 text-muted-foreground" />
                                  </div>

                                  <div className="flex-1 py-1.5 px-2 min-w-0">
                                    <span className="font-semibold line-clamp-1 text-foreground">
                                      {lesson.title}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground flex-wrap">
                                      {lesson.quizSetTitle && (
                                        <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 font-medium">
                                          <HelpCircle className="h-3 w-3" /> Quiz
                                        </span>
                                      )}
                                      {lesson.resources && lesson.resources.length > 0 && (
                                        <span className="text-sky-600 dark:text-sky-400 flex items-center gap-0.5 font-medium">
                                          <Paperclip className="h-3 w-3" /> {lesson.resources.length} Files
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="ml-auto pr-3 flex items-center gap-x-2 shrink-0">
                                    {lesson.isFree && (
                                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/40">
                                        Free
                                      </Badge>
                                    )}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLessonId(lesson.id);
                                      }}
                                      className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        isSelected
                                          ? "text-sky-600 bg-sky-100 dark:bg-sky-900/60"
                                          : "hover:text-sky-600 hover:bg-muted text-muted-foreground"
                                      )}
                                      title="Select Lesson"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteLesson(lesson.id);
                                      }}
                                      className="p-1.5 hover:text-destructive text-muted-foreground transition-colors rounded-lg hover:bg-destructive/10"
                                      title="Delete Lesson"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <p className="text-xs text-muted-foreground text-center pt-1">
                  Drag & drop to reorder lessons. Click any lesson to inspect and edit its content on the left panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModulePage;
