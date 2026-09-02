import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IconBadge } from "@/components/common/icon-badge";
import { AlertBanner } from "@/components/common/alert-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { Lesson, LessonResource } from "@/types/course";

export const EditModulePage: React.FC = () => {
  const { courseId = "1", moduleId = "1" } = useParams();
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

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  // Lesson Edit Modal State
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // New Resource Form state inside modal
  const [newResTitle, setNewResTitle] = useState("");
  const [newResSize, setNewResSize] = useState("");
  const [newResUrl, setNewResUrl] = useState("");

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
      description: "Lesson details and objectives.",
      videoUrl: "https://www.youtube.com/embed/666K4aizIu8",
      isFree: false,
      isPublished: true,
      position: lessons.length + 1,
      resources: [],
    };
    setLessons([...lessons, newLesson]);
    setNewLessonTitle("");
    setIsAddingLesson(false);
    toast.success("Lesson added");
  };

  const handleSaveLessonModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    setLessons(
      lessons.map((l) => (l.id === editingLesson.id ? editingLesson : l))
    );
    setEditingLesson(null);
    toast.success("Lesson updated with Description, Quiz, & Resources!");
  };

  const handleDeleteLesson = (lessonId: string | number) => {
    setLessons(lessons.filter((l) => l.id !== lessonId));
    setEditingLesson(null);
    toast.success("Lesson deleted");
  };

  const handleAddResourceToLesson = () => {
    if (!newResTitle.trim() || !editingLesson) return;
    const newRes: LessonResource = {
      id: `res-${Date.now()}`,
      title: newResTitle,
      size: newResSize || "1.5 MB",
      url: newResUrl || "https://github.com",
    };
    const updatedResources = [...(editingLesson.resources || []), newRes];
    setEditingLesson({
      ...editingLesson,
      resources: updatedResources,
    });
    setNewResTitle("");
    setNewResSize("");
    setNewResUrl("");
    toast.success("Resource attachment added");
  };

  const handleDeleteResourceFromLesson = (resId: string | number) => {
    if (!editingLesson) return;
    const updatedResources = (editingLesson.resources || []).filter(
      (r) => r.id !== resId
    );
    setEditingLesson({
      ...editingLesson,
      resources: updatedResources,
    });
    toast.success("Resource removed");
  };

  return (
    <>
      {!isPublished && (
        <AlertBanner
          label="This module is unpublished. It will not be visible in the course."
          variant="warning"
        />
      )}

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to={`/dashboard/courses/${courseId}`}
            className="flex items-center text-sm hover:text-sky-600 transition-colors gap-1.5"
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Module Details Form */}
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-bold">Customize Your Module</h2>
            </div>

            <div className="border bg-card rounded-xl p-4 shadow-sm">
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
                <p className="text-sm font-semibold mt-2">{moduleTitle}</p>
              ) : (
                <div className="mt-3 space-y-3">
                  <Input
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                  />
                  <Button
                    size="sm"
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

          {/* Module Lessons with Drag and Drop */}
          <div className="space-y-6">
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

            <div className="border bg-card rounded-xl p-4 shadow-sm space-y-4">
              {isAddingLesson && (
                <form onSubmit={handleAddLesson} className="space-y-3 pb-3 border-b">
                  <Input
                    placeholder="e.g. 'Component Lifecycle in Depth'"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    required
                  />
                  <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-700">
                    Create Lesson
                  </Button>
                </form>
              )}

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="lessons">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {lessons.map((lesson, index) => (
                        <Draggable
                          key={String(lesson.id)}
                          draggableId={String(lesson.id)}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-x-2 bg-muted/60 border rounded-lg text-sm overflow-hidden"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="px-3 py-3 border-r hover:bg-muted cursor-grab active:cursor-grabbing"
                              >
                                <Grip className="h-4 w-4 text-muted-foreground" />
                              </div>

                              <div className="flex-1 py-1 px-2">
                                <span className="font-semibold line-clamp-1">
                                  {lesson.title}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground flex-wrap">
                                  {lesson.quizSetTitle && (
                                    <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                                      <HelpCircle className="h-3 w-3" /> Quiz Attached
                                    </span>
                                  )}
                                  {lesson.resources && lesson.resources.length > 0 && (
                                    <span className="text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
                                      <Paperclip className="h-3 w-3" /> {lesson.resources.length} Resources
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="ml-auto pr-3 flex items-center gap-x-2">
                                {lesson.isFree && (
                                  <Badge variant="outline" className="text-[10px] text-emerald-600">
                                    Free
                                  </Badge>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setEditingLesson(lesson)}
                                  className="p-1.5 hover:text-sky-600 hover:bg-muted rounded-md transition-colors"
                                  title="Configure Lesson (Video, Description, Quiz, Resources)"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <p className="text-xs text-muted-foreground text-center">
                Drag and drop to reorder lessons. Click the pencil icon to configure Description, Quiz Assessment, and Resources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Lesson Configuration Modal with Tabs */}
      {editingLesson && (
        <Dialog open={Boolean(editingLesson)} onOpenChange={() => setEditingLesson(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Video className="h-5 w-5 text-sky-600" />
                Lesson Configuration & Content
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveLessonModal} className="space-y-4 pt-2">
              <Tabs defaultValue="video" className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="video" className="text-xs">
                    Video & Details
                  </TabsTrigger>
                  <TabsTrigger value="description" className="text-xs">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="text-xs">
                    Quiz Assessment
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="text-xs">
                    Resources ({editingLesson.resources?.length || 0})
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Video & Details */}
                <TabsContent value="video" className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Lesson Title *
                    </label>
                    <Input
                      value={editingLesson.title}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Video URL (YouTube / Vimeo / MP4 Stream)
                    </label>
                    <Input
                      value={editingLesson.videoUrl || ""}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, videoUrl: e.target.value })
                      }
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>

                  <div className="flex items-center space-x-2 border p-3 rounded-lg bg-muted/20">
                    <Checkbox
                      id="isFree"
                      checked={editingLesson.isFree || false}
                      onCheckedChange={(checked) =>
                        setEditingLesson({
                          ...editingLesson,
                          isFree: Boolean(checked),
                        })
                      }
                    />
                    <label
                      htmlFor="isFree"
                      className="text-xs font-medium cursor-pointer"
                    >
                      Make this lesson a Free Preview for all learners
                    </label>
                  </div>
                </TabsContent>

                {/* Tab 2: Lesson Description */}
                <TabsContent value="description" className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Lesson Notes & Description
                    </label>
                    <Textarea
                      value={editingLesson.description || ""}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter in-depth lesson notes, key takeaways, and code overview that students see under the video player..."
                      rows={6}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      This content will appear directly in the student's <strong>Lesson Description</strong> tab.
                    </p>
                  </div>
                </TabsContent>

                {/* Tab 3: Quiz Assessment */}
                <TabsContent value="quiz" className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">
                      Attach Quiz Set Assessment
                    </label>
                    <Select
                      value={String(editingLesson.quizSetId || "none")}
                      onValueChange={(val) => {
                        if (val === "none") {
                          setEditingLesson({
                            ...editingLesson,
                            quizSetId: undefined,
                            quizSetTitle: undefined,
                          });
                        } else {
                          const selected = quizSets.find((q) => String(q.id) === val);
                          setEditingLesson({
                            ...editingLesson,
                            quizSetId: val,
                            quizSetTitle: selected?.title || "Module Quiz",
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Quiz Set" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Quiz Attached</SelectItem>
                        {quizSets.map((q) => (
                          <SelectItem key={q.id} value={String(q.id)}>
                            {q.title} ({q.questions?.length || 0} Questions • {q.totalMarks || 20} Pts)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {editingLesson.quizSetId && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Attached: <strong>{editingLesson.quizSetTitle}</strong></span>
                      </div>
                      <Badge variant="success">Active Assessment</Badge>
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground">
                    Students will be able to take this quiz under the <strong>Quiz Assessment</strong> tab in the video player.
                  </p>
                </TabsContent>

                {/* Tab 4: Downloadable Resources */}
                <TabsContent value="resources" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block">
                      Attached Resource Files
                    </label>

                    {(!editingLesson.resources || editingLesson.resources.length === 0) ? (
                      <p className="text-xs text-muted-foreground p-3 border rounded-lg bg-muted/20">
                        No downloadable resources attached yet.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {editingLesson.resources.map((res) => (
                          <div
                            key={res.id}
                            className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-sky-600" />
                              <div>
                                <span className="font-semibold">{res.title}</span>
                                <span className="text-muted-foreground ml-2 text-[10px]">
                                  {res.size}
                                </span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleDeleteResourceFromLesson(res.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add New Resource Form */}
                  <div className="border p-3 rounded-lg bg-muted/30 space-y-3">
                    <span className="text-xs font-bold block text-foreground">
                      + Add Downloadable Resource File
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        placeholder="File name (e.g. starter-code.zip)"
                        value={newResTitle}
                        onChange={(e) => setNewResTitle(e.target.value)}
                        className="text-xs"
                      />
                      <Input
                        placeholder="Size (e.g. 2.4 MB)"
                        value={newResSize}
                        onChange={(e) => setNewResSize(e.target.value)}
                        className="text-xs"
                      />
                      <Input
                        placeholder="Download URL"
                        value={newResUrl}
                        onChange={(e) => setNewResUrl(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleAddResourceToLesson}
                      className="text-xs w-full"
                    >
                      Attach Resource to Lesson
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteLesson(editingLesson.id)}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Lesson
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingLesson(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-700">
                    Save Lesson Configuration
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EditModulePage;
