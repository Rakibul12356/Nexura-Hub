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
  CheckCircle2,
  Github,
  Link2,
  UploadCloud,
  AlignLeft,
  Bold,
  Italic,
  List,
  Code,
  Eye,
  FileUp,
  FileCheck,
  Globe,
  X,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";
import { Lesson, LessonResource, QuizQuestion } from "@/types/course";
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
      questions: [
        {
          id: "q-1",
          title: "Which hook is used for side effects in React functional components?",
          options: [
            { id: "opt-1", label: "useEffect", isCorrect: true },
            { id: "opt-2", label: "useState", isCorrect: false },
            { id: "opt-3", label: "useReducer", isCorrect: false },
            { id: "opt-4", label: "useMemo", isCorrect: false },
          ],
        },
      ],
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
      questions: [
        {
          id: "q-2",
          title: "What does the Virtual DOM do in React?",
          options: [
            { id: "opt-21", label: "Optimizes DOM updates with diffing algorithm", isCorrect: true },
            { id: "opt-22", label: "Replaces HTML completely", isCorrect: false },
            { id: "opt-23", label: "Runs database queries", isCorrect: false },
            { id: "opt-24", label: "Styling CSS components", isCorrect: false },
          ],
        },
      ],
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

  // Resource Form states (GitHub link, External link, PDF upload, RichText note)
  const [resType, setResType] = useState<"github" | "link" | "pdf" | "richtext">("github");
  const [newResTitle, setNewResTitle] = useState("");
  const [newResSize, setNewResSize] = useState("");
  const [newResUrl, setNewResUrl] = useState("");
  const [newResContent, setNewResContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [selectedNoteForModal, setSelectedNoteForModal] = useState<LessonResource | null>(null);

  // Quiz Question Form states inside Quiz Tab
  const [qTitle, setQTitle] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctIndex, setCorrectIndex] = useState<number>(0);

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
      questions: [],
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

  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      setNewResSize(sizeMB);
      if (!newResTitle) {
        setNewResTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      setNewResUrl(URL.createObjectURL(file));
      toast.success(`PDF File selected: ${file.name} (${sizeMB})`);
    }
  };

  const handleInsertFormatting = (prefix: string, suffix: string = "") => {
    setNewResContent((prev) => `${prev}${prefix}sample text${suffix}`);
  };

  const handleAddResourceToActiveLesson = () => {
    if (!newResTitle.trim() || !activeLesson) {
      toast.error("Please enter a resource title!");
      return;
    }

    let finalUrl = newResUrl;
    let finalSize = newResSize;

    if (resType === "github" && !finalUrl.trim()) {
      finalUrl = "https://github.com/example/repository";
    } else if (resType === "link" && !finalUrl.trim()) {
      finalUrl = "https://react.dev/reference";
    } else if (resType === "pdf") {
      if (!finalUrl.trim()) finalUrl = "https://react.dev/cheatsheet.pdf";
      if (!finalSize.trim()) finalSize = "1.8 MB";
    }

    const newRes: LessonResource = {
      id: `res-${Date.now()}`,
      title: newResTitle,
      type: resType,
      url: finalUrl,
      size: finalSize,
      content: resType === "richtext" ? newResContent : undefined,
      fileName: uploadedFileName,
    };

    const updatedResources = [...(activeLesson.resources || []), newRes];
    handleUpdateActiveLesson({ resources: updatedResources });

    setNewResTitle("");
    setNewResSize("");
    setNewResUrl("");
    setNewResContent("");
    setUploadedFileName("");
    toast.success("Resource added successfully!");
  };

  const handleDeleteResourceFromActiveLesson = (resId: string | number) => {
    if (!activeLesson) return;
    const updatedResources = (activeLesson.resources || []).filter(
      (r) => r.id !== resId
    );
    handleUpdateActiveLesson({ resources: updatedResources });
    toast.success("Resource removed");
  };

  const handleAddInlineQuestion = () => {
    if (!qTitle.trim()) {
      toast.error("Please enter a question title!");
      return;
    }
    if (!optA.trim() || !optB.trim()) {
      toast.error("Please provide at least Option A and Option B (Minimum 2 options)!");
      return;
    }

    const rawOpts = [
      { text: optA.trim(), origIdx: 0 },
      { text: optB.trim(), origIdx: 1 },
      { text: optC.trim(), origIdx: 2 },
      { text: optD.trim(), origIdx: 3 },
    ].filter((o) => o.text.length > 0);

    const options = rawOpts.map((o) => ({
      id: `opt-${o.origIdx}-${Date.now()}`,
      label: o.text,
      isCorrect: correctIndex === o.origIdx,
    }));

    const updatedQuestions = [...(activeLesson.questions || []), {
      id: `q-${Date.now()}`,
      title: qTitle,
      options,
    }];

    handleUpdateActiveLesson({
      questions: updatedQuestions,
      quizSetTitle: activeLesson.quizSetTitle || "Lesson Quiz Assessment",
    });

    setQTitle("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setCorrectIndex(0);
    toast.success("Quiz question added!");
  };

  const handleDeleteInlineQuestion = (qId: string | number) => {
    const updatedQuestions = (activeLesson.questions || []).filter(
      (q) => String(q.id) !== String(qId)
    );
    handleUpdateActiveLesson({ questions: updatedQuestions });
    toast.success("Question removed");
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
                <Tabs defaultValue="quiz" className="w-full pt-2">
                  <TabsList className="grid grid-cols-4 w-full bg-muted/60 p-1 rounded-xl">
                    <TabsTrigger value="details" className="text-xs rounded-lg">
                      Video & Title
                    </TabsTrigger>
                    <TabsTrigger value="description" className="text-xs rounded-lg">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="text-xs rounded-lg">
                      Quiz ({activeLesson.questions?.length || 0})
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

                  {/* Tab 3: Quiz Assessment (Create Quiz Title, Add Questions with 4 Options directly!) */}
                  <TabsContent value="quiz" className="space-y-6 pt-4">
                    {/* Quiz Title */}
                    <div className="border rounded-2xl p-4 bg-muted/20">
                      <label className="text-xs font-semibold block mb-1">
                        Quiz Title / Assessment Name *
                      </label>
                      <Input
                        value={activeLesson.quizSetTitle || ""}
                        onChange={(e) =>
                          handleUpdateActiveLesson({ quizSetTitle: e.target.value })
                        }
                        placeholder="e.g. 'React Fundamentals Quiz'"
                        className="bg-card font-semibold"
                      />
                    </div>

                    {/* Add Question Form (Directly inside Quiz tab!) */}
                    <div className="border rounded-2xl p-5 bg-card shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm font-bold flex items-center gap-2 text-foreground">
                          <PlusCircle className="h-4 w-4 text-sky-600" />
                          Add Quiz Question (4 Options)
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Mark radio button for the correct answer
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-1">
                          Question Title / Statement *
                        </label>
                        <Input
                          value={qTitle}
                          onChange={(e) => setQTitle(e.target.value)}
                          placeholder="e.g. 'Which hook handles side effects in React?'"
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-semibold block text-muted-foreground">
                          4 Multiple Choice Options (Select 1 Correct):
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option A */}
                          <div className="flex items-center gap-2 border p-2.5 rounded-xl bg-muted/20">
                            <input
                              type="radio"
                              name="correctOption"
                              id="opt-radio-0"
                              checked={correctIndex === 0}
                              onChange={() => setCorrectIndex(0)}
                              className="h-4 w-4 text-sky-600 cursor-pointer"
                            />
                            <label htmlFor="opt-radio-0" className="text-xs font-bold text-sky-600 shrink-0">
                              A:
                            </label>
                            <Input
                              placeholder="Option A text"
                              value={optA}
                              onChange={(e) => setOptA(e.target.value)}
                              className="text-xs h-8 bg-card"
                            />
                          </div>

                          {/* Option B */}
                          <div className="flex items-center gap-2 border p-2.5 rounded-xl bg-muted/20">
                            <input
                              type="radio"
                              name="correctOption"
                              id="opt-radio-1"
                              checked={correctIndex === 1}
                              onChange={() => setCorrectIndex(1)}
                              className="h-4 w-4 text-sky-600 cursor-pointer"
                            />
                            <label htmlFor="opt-radio-1" className="text-xs font-bold text-sky-600 shrink-0">
                              B:
                            </label>
                            <Input
                              placeholder="Option B text"
                              value={optB}
                              onChange={(e) => setOptB(e.target.value)}
                              className="text-xs h-8 bg-card"
                            />
                          </div>

                          {/* Option C */}
                          <div className="flex items-center gap-2 border p-2.5 rounded-xl bg-muted/20">
                            <input
                              type="radio"
                              name="correctOption"
                              id="opt-radio-2"
                              checked={correctIndex === 2}
                              onChange={() => setCorrectIndex(2)}
                              className="h-4 w-4 text-sky-600 cursor-pointer"
                            />
                            <label htmlFor="opt-radio-2" className="text-xs font-bold text-sky-600 shrink-0">
                              C:
                            </label>
                            <Input
                              placeholder="Option C text"
                              value={optC}
                              onChange={(e) => setOptC(e.target.value)}
                              className="text-xs h-8 bg-card"
                            />
                          </div>

                          {/* Option D */}
                          <div className="flex items-center gap-2 border p-2.5 rounded-xl bg-muted/20">
                            <input
                              type="radio"
                              name="correctOption"
                              id="opt-radio-3"
                              checked={correctIndex === 3}
                              onChange={() => setCorrectIndex(3)}
                              className="h-4 w-4 text-sky-600 cursor-pointer"
                            />
                            <label htmlFor="opt-radio-3" className="text-xs font-bold text-sky-600 shrink-0">
                              D:
                            </label>
                            <Input
                              placeholder="Option D text"
                              value={optD}
                              onChange={(e) => setOptD(e.target.value)}
                              className="text-xs h-8 bg-card"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddInlineQuestion}
                        className="bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1.5 mt-2"
                      >
                        <PlusCircle className="h-4 w-4" /> Add Question to Quiz
                      </Button>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                        Quiz Questions ({activeLesson.questions?.length || 0})
                      </span>

                      {activeLesson.questions && activeLesson.questions.length > 0 ? (
                        activeLesson.questions.map((q, idx) => (
                          <div key={q.id} className="border bg-card rounded-2xl p-4 shadow-sm space-y-3">
                            <div className="flex items-start justify-between gap-2 border-b pb-2">
                              <div className="space-y-0.5">
                                <span className="text-xs font-bold text-sky-600">Question #{idx + 1}</span>
                                <p className="text-sm font-semibold text-foreground">{q.title}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                                onClick={() => handleDeleteInlineQuestion(q.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {q.options.map((opt, optIdx) => (
                                <div
                                  key={opt.id || optIdx}
                                  className={cn(
                                    "p-2.5 rounded-xl border flex items-center justify-between",
                                    opt.isCorrect
                                      ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium"
                                      : "bg-muted/30 text-muted-foreground"
                                  )}
                                >
                                  <span>
                                    <strong className="mr-1.5">{["A", "B", "C", "D"][optIdx]}:</strong>
                                    {opt.label}
                                  </span>
                                  {opt.isCorrect && (
                                    <Badge variant="success" className="text-[10px] py-0 px-1.5">
                                      Correct
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 border rounded-2xl text-center text-xs text-muted-foreground bg-muted/20">
                          No quiz questions added yet. Use the form above to add questions with 4 options!
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Tab 4: Resources, Attachments & Rich Text Notes */}
                  <TabsContent value="resources" className="space-y-6 pt-4">
                    <div className="border bg-card rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                        <div>
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-sky-600" /> Add Lesson Resource & References
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            Attach GitHub repositories, PDF files, reference links, or write Rich Text notes.
                          </p>
                        </div>
                      </div>

                      {/* Type Selection Tabs */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setResType("github")}
                          className={cn(
                            "flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                            resType === "github"
                              ? "bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-600 shadow-sm"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <Github className="h-3.5 w-3.5" /> GitHub Link
                        </button>

                        <button
                          type="button"
                          onClick={() => setResType("link")}
                          className={cn(
                            "flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                            resType === "link"
                              ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <Link2 className="h-3.5 w-3.5" /> Reference Link
                        </button>

                        <button
                          type="button"
                          onClick={() => setResType("pdf")}
                          className={cn(
                            "flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                            resType === "pdf"
                              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <FileText className="h-3.5 w-3.5" /> Upload PDF
                        </button>

                        <button
                          type="button"
                          onClick={() => setResType("richtext")}
                          className={cn(
                            "flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                            resType === "richtext"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <AlignLeft className="h-3.5 w-3.5" /> Rich Text Note
                        </button>
                      </div>

                      {/* Form according to resType */}
                      <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                        {/* Title (Common) */}
                        <div>
                          <label className="text-xs font-semibold block mb-1">Resource Title *</label>
                          <Input
                            placeholder={
                              resType === "github"
                                ? "e.g. 'Lecture 01 Starter Code Repository'"
                                : resType === "pdf"
                                ? "e.g. 'React Architecture & Hooks Cheatsheet.pdf'"
                                : resType === "link"
                                ? "e.g. 'Official React Hooks Documentation'"
                                : "e.g. 'Important Lesson Summary & Key Formulae'"
                            }
                            value={newResTitle}
                            onChange={(e) => setNewResTitle(e.target.value)}
                            className="text-xs bg-card"
                          />
                        </div>

                        {/* GitHub Type */}
                        {resType === "github" && (
                          <div>
                            <label className="text-xs font-semibold block mb-1">GitHub Repository URL</label>
                            <div className="relative">
                              <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="https://github.com/username/project-repo"
                                value={newResUrl}
                                onChange={(e) => setNewResUrl(e.target.value)}
                                className="text-xs pl-9 bg-card"
                              />
                            </div>
                          </div>
                        )}

                        {/* Link Type */}
                        {resType === "link" && (
                          <div>
                            <label className="text-xs font-semibold block mb-1">External Web / Reference Link</label>
                            <div className="relative">
                              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="https://react.dev/reference/react"
                                value={newResUrl}
                                onChange={(e) => setNewResUrl(e.target.value)}
                                className="text-xs pl-9 bg-card"
                              />
                            </div>
                          </div>
                        )}

                        {/* PDF Upload Type */}
                        {resType === "pdf" && (
                          <div className="space-y-3">
                            <label className="text-xs font-semibold block">Upload PDF Document</label>
                            <div className="border-2 border-dashed rounded-xl p-4 text-center bg-card hover:bg-muted/10 transition-colors">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.zip"
                                id="pdf-file-upload"
                                className="hidden"
                                onChange={handlePdfFileUpload}
                              />
                              <label htmlFor="pdf-file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
                                <UploadCloud className="h-7 w-7 text-rose-500" />
                                <span className="text-xs font-bold text-foreground">
                                  {uploadedFileName ? uploadedFileName : "Click to browse and upload PDF file"}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  Supports PDF, DOC, DOCX, ZIP files (Max: 50MB)
                                </span>
                              </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                                  File Size (e.g. 2.4 MB)
                                </label>
                                <Input
                                  placeholder="e.g. 2.4 MB"
                                  value={newResSize}
                                  onChange={(e) => setNewResSize(e.target.value)}
                                  className="text-xs bg-card"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                                  Direct PDF Download URL (Optional)
                                </label>
                                <Input
                                  placeholder="https://..."
                                  value={newResUrl}
                                  onChange={(e) => setNewResUrl(e.target.value)}
                                  className="text-xs bg-card"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rich Text Note Type */}
                        {resType === "richtext" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-semibold block">Rich Text Content & Guide</label>
                              {/* Formatting Toolbar */}
                              <div className="flex items-center gap-1 border p-1 rounded-lg bg-card">
                                <button
                                  type="button"
                                  onClick={() => handleInsertFormatting("**", "**")}
                                  className="p-1 rounded hover:bg-muted text-xs font-bold"
                                  title="Bold"
                                >
                                  <Bold className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInsertFormatting("*", "*")}
                                  className="p-1 rounded hover:bg-muted text-xs italic"
                                  title="Italic"
                                >
                                  <Italic className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInsertFormatting("\n- ")}
                                  className="p-1 rounded hover:bg-muted text-xs"
                                  title="Bullet List"
                                >
                                  <List className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInsertFormatting("`", "`")}
                                  className="p-1 rounded hover:bg-muted text-xs"
                                  title="Inline Code"
                                >
                                  <Code className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            <Textarea
                              rows={5}
                              placeholder="Write notes, code snippets, formulas, or key instructions for students here..."
                              value={newResContent}
                              onChange={(e) => setNewResContent(e.target.value)}
                              className="text-xs bg-card font-mono"
                            />
                          </div>
                        )}

                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddResourceToActiveLesson}
                          className="bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1.5 mt-2"
                        >
                          <PlusCircle className="h-4 w-4" /> Save & Attach Resource
                        </Button>
                      </div>

                      {/* Attached Resources List */}
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                          Attached Resources ({activeLesson.resources?.length || 0})
                        </span>

                        {activeLesson.resources && activeLesson.resources.length > 0 ? (
                          <div className="space-y-2">
                            {activeLesson.resources.map((res) => {
                              const isGithub = res.type === "github" || res.url?.includes("github.com");
                              const isPdf = res.type === "pdf" || res.title.endsWith(".pdf") || res.size?.includes("MB");
                              const isRichText = res.type === "richtext" || Boolean(res.content);

                              return (
                                <div
                                  key={res.id}
                                  className="flex items-center justify-between p-3 rounded-2xl border bg-card text-xs shadow-sm hover:border-sky-300 transition-colors"
                                >
                                  <div className="flex items-center gap-3 truncate">
                                    <div className="p-2 rounded-xl bg-muted/50 shrink-0">
                                      {isGithub ? (
                                        <Github className="h-4 w-4 text-slate-900 dark:text-sky-400" />
                                      ) : isPdf ? (
                                        <FileText className="h-4 w-4 text-rose-500" />
                                      ) : isRichText ? (
                                        <AlignLeft className="h-4 w-4 text-emerald-600" />
                                      ) : (
                                        <Globe className="h-4 w-4 text-sky-600" />
                                      )}
                                    </div>

                                    <div className="truncate space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-foreground truncate">{res.title}</span>
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "text-[10px] py-0 px-1.5 font-medium",
                                            isGithub
                                              ? "border-slate-400 text-slate-700 dark:text-slate-300"
                                              : isPdf
                                              ? "border-rose-400 text-rose-600 bg-rose-50/50 dark:bg-rose-950/30"
                                              : isRichText
                                              ? "border-emerald-400 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30"
                                              : "border-sky-400 text-sky-600"
                                          )}
                                        >
                                          {isGithub ? "GitHub Repo" : isPdf ? "PDF Document" : isRichText ? "Rich Text Note" : "Reference Link"}
                                        </Badge>
                                      </div>
                                      {res.size && <p className="text-[10px] text-muted-foreground">File Size: {res.size}</p>}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {isRichText && res.content ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedNoteForModal(res)}
                                        className="h-7 text-[11px] gap-1 text-emerald-600 border-emerald-300 hover:bg-emerald-50 cursor-pointer"
                                      >
                                        <Eye className="h-3.5 w-3.5" /> Read Note
                                      </Button>
                                    ) : (
                                      <a
                                        href={res.url || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sky-600 hover:underline flex items-center gap-1 text-[11px] font-semibold border px-2.5 py-1 rounded-xl bg-muted/30"
                                      >
                                        {isPdf ? (
                                          <>
                                            <Download className="h-3.5 w-3.5" /> Download PDF
                                          </>
                                        ) : (
                                          <>
                                            <ExternalLink className="h-3.5 w-3.5" /> Open
                                          </>
                                        )}
                                      </a>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteResourceFromActiveLesson(res.id)}
                                      className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                                      title="Remove Resource"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-4 border rounded-2xl bg-muted/20">
                            No resources attached to this lesson yet. Choose a resource type above to add GitHub links, PDFs, or Rich Text notes!
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Modal for Reading Rich Text Notes */}
                    {selectedNoteForModal && (
                      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-card border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                          <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2">
                              <AlignLeft className="h-5 w-5 text-emerald-600" />
                              <h3 className="font-bold text-base">{selectedNoteForModal.title}</h3>
                            </div>
                            <button
                              onClick={() => setSelectedNoteForModal(null)}
                              className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="prose dark:prose-invert text-xs bg-muted/30 p-4 rounded-xl font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                            {selectedNoteForModal.content || "No content written."}
                          </div>

                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              onClick={() => setSelectedNoteForModal(null)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            >
                              Close Note
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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
