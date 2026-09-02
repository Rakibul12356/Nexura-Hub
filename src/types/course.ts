export interface Category {
  id: string | number;
  title: string;
  thumbnail: string;
  value?: string;
  label?: string;
}

export interface LessonResource {
  id: string | number;
  title: string;
  url?: string;
  size?: string;
}

export interface Lesson {
  id: string | number;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: string;
  isFree?: boolean;
  isPublished?: boolean;
  position?: number;
  completed?: boolean;
  quizSetId?: string | number;
  quizSetTitle?: string;
  resources?: LessonResource[];
}

export interface Module {
  id: string | number;
  title: string;
  description?: string;
  position?: number;
  isPublished?: boolean;
  lessons?: Lesson[];
}

export interface QuizOption {
  id: string | number;
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string | number;
  title: string;
  description?: string;
  options: QuizOption[];
  points?: number;
}

export interface QuizSet {
  id: string | number;
  title: string;
  description?: string;
  totalMarks?: number;
  isPublished?: boolean;
  questions?: QuizQuestion[];
}

export interface CourseReview {
  id: string | number;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Course {
  id: string | number;
  slug?: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  categoryId?: string | number;
  thumbnail: string;
  price: number;
  discountPrice?: number;
  isPublished: boolean;
  totalChapters?: number;
  progress?: number;
  instructor?: {
    id: string | number;
    name: string;
    designation: string;
    avatar: string;
    bio?: string;
    rating?: number;
    studentsCount?: number;
    coursesCount?: number;
    reviewsCount?: number;
  };
  modules?: Module[];
  quizSets?: QuizSet[];
  reviews?: CourseReview[];
  learningPoints?: string[];
}

export interface EnrolledCourse extends Course {
  enrolledDate: string;
  completedModules: number;
  totalModules: number;
  completedQuizzes: number;
  totalQuizzes: number;
  quizScore: number;
  otherScore: number;
  totalScore: number;
}
