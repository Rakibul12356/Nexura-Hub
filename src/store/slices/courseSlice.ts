import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course, Category, EnrolledCourse } from "@/types/course";

export const initialCategories: Category[] = [
  { id: 1, title: "Design", thumbnail: "/assets/images/categories/design.jpg", value: "design", label: "Design" },
  { id: 3, title: "Development", thumbnail: "/assets/images/categories/development.jpg", value: "development", label: "Development" },
  { id: 4, title: "Marketing", thumbnail: "/assets/images/categories/marketing.jpg", value: "marketing", label: "Marketing" },
  { id: 5, title: "IT & Software", thumbnail: "/assets/images/categories/it_software.jpg", value: "it-software", label: "IT & Software" },
  { id: 6, title: "Personal Development", thumbnail: "/assets/images/categories/personal_development.jpg", value: "personal-development", label: "Personal Development" },
  { id: 7, title: "Business", thumbnail: "/assets/images/categories/business.jpg", value: "business", label: "Business" },
  { id: 8, title: "Photography", thumbnail: "/assets/images/categories/photography.jpg", value: "photography", label: "Photography" },
  { id: 9, title: "Music", thumbnail: "/assets/images/categories/music.jpg", value: "music", label: "Music" },
];

export const initialCourses: Course[] = [
  {
    id: 1,
    slug: "reactive-accelerator",
    title: "Reactive Accelerator",
    subtitle: "Master React JS & Next JS from beginner to advanced",
    description: "A comprehensive journey through modern frontend web development using React, Redux Toolkit, Next.js, and Tailwind CSS.",
    category: "Development",
    categoryId: 3,
    thumbnail: "/assets/images/courses/course_1.png",
    price: 49,
    discountPrice: 39,
    isPublished: true,
    totalChapters: 4,
    progress: 80,
    instructor: {
      id: "inst-1",
      name: "Tapas Adhikary",
      designation: "Senior Software Engineer",
      avatar: "https://avatars.githubusercontent.com/u/3633137?v=4",
      bio: "Passionate developer and educator specializing in React and TypeScript.",
      rating: 4.9,
      studentsCount: 2400,
      coursesCount: 12,
      reviewsCount: 1500,
    },
    modules: [
      {
        id: "mod-1",
        title: "Introduction to React Ecosystem",
        isPublished: true,
        position: 1,
        lessons: [
          { id: "les-1", title: "Introduction", videoUrl: "https://www.youtube.com/embed/666K4aizIu8", duration: "12m", isFree: true, isPublished: true, position: 1, completed: true },
          { id: "les-2", title: "What is React & Virtual DOM?", videoUrl: "https://www.youtube.com/embed/666K4aizIu8", duration: "18m", isFree: true, isPublished: true, position: 2, completed: true },
          { id: "les-3", title: "Components, Props and State", videoUrl: "https://www.youtube.com/embed/666K4aizIu8", duration: "25m", isFree: false, isPublished: true, position: 3, completed: false },
        ],
      },
      {
        id: "mod-2",
        title: "State Management with Redux Toolkit",
        isPublished: true,
        position: 2,
        lessons: [
          { id: "les-4", title: "Why Redux in Large Apps?", videoUrl: "https://www.youtube.com/embed/666K4aizIu8", duration: "15m", isFree: false, isPublished: true, position: 1, completed: false },
          { id: "les-5", title: "Slices, Reducers and Dispatch", videoUrl: "https://www.youtube.com/embed/666K4aizIu8", duration: "30m", isFree: false, isPublished: true, position: 2, completed: false },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "think-in-a-redux-way",
    title: "Think In A Redux Way",
    subtitle: "Deep dive into state architecture and async thunks",
    description: "Learn how to architect clean, predictable, and scalable state in enterprise React applications.",
    category: "Development",
    categoryId: 3,
    thumbnail: "/assets/images/courses/course_1.png",
    price: 39,
    isPublished: true,
    totalChapters: 5,
    progress: 45,
    instructor: {
      id: "inst-1",
      name: "Tapas Adhikary",
      designation: "Senior Software Engineer",
      avatar: "https://avatars.githubusercontent.com/u/3633137?v=4",
      rating: 4.9,
    },
  },
  {
    id: 3,
    slug: "modern-full-stack-web-design",
    title: "Modern UI/UX Design with Tailwind",
    subtitle: "Craft gorgeous, responsive web interfaces",
    description: "Master typography, color harmony, responsive layouts, and animations.",
    category: "Design",
    categoryId: 1,
    thumbnail: "/assets/images/categories/design.jpg",
    price: 29,
    isPublished: true,
    totalChapters: 6,
    progress: 10,
    instructor: {
      id: "inst-2",
      name: "Jenny Jimenez",
      designation: "Product Designer",
      avatar: "/assets/images/profile.jpg",
      rating: 4.8,
    },
  },
  {
    id: 4,
    slug: "digital-marketing-mastery",
    title: "Digital Marketing & SEO Mastery",
    subtitle: "Grow organic traffic and conversion funnels",
    description: "Hands-on strategies for social media marketing, SEO, and paid ad campaigns.",
    category: "Marketing",
    categoryId: 4,
    thumbnail: "/assets/images/categories/marketing.jpg",
    price: 19,
    isPublished: true,
    totalChapters: 3,
    progress: 0,
    instructor: {
      id: "inst-3",
      name: "Alex Morgan",
      designation: "Growth Marketer",
      avatar: "/assets/images/profile.jpg",
      rating: 4.7,
    },
  },
];

export const initialEnrolledCourses: EnrolledCourse[] = [
  {
    ...initialCourses[0],
    enrolledDate: "15 Jan 2024",
    completedModules: 5,
    totalModules: 10,
    completedQuizzes: 10,
    totalQuizzes: 10,
    quizScore: 50,
    otherScore: 50,
    totalScore: 100,
  },
  {
    ...initialCourses[1],
    enrolledDate: "20 Feb 2024",
    completedModules: 2,
    totalModules: 8,
    completedQuizzes: 4,
    totalQuizzes: 8,
    quizScore: 35,
    otherScore: 40,
    totalScore: 75,
  },
];

interface CourseFilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedPrice: string[];
  sortBy: string;
}

interface CourseSliceState {
  courses: Course[];
  categories: Category[];
  enrolledCourses: EnrolledCourse[];
  activeCourse: Course | null;
  filters: CourseFilterState;
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseSliceState = {
  courses: initialCourses,
  categories: initialCategories,
  enrolledCourses: initialEnrolledCourses,
  activeCourse: initialCourses[0],
  filters: {
    searchQuery: "",
    selectedCategories: ["development"],
    selectedPrice: [],
    sortBy: "",
  },
  isLoading: false,
  error: null,
};

export const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    setActiveCourse: (state, action: PayloadAction<Course | null>) => {
      state.activeCourse = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    toggleCategoryFilter: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.filters.selectedCategories.includes(category)) {
        state.filters.selectedCategories = state.filters.selectedCategories.filter(
          (c) => c !== category
        );
      } else {
        state.filters.selectedCategories.push(category);
      }
    },
    togglePriceFilter: (state, action: PayloadAction<string>) => {
      const price = action.payload;
      if (state.filters.selectedPrice.includes(price)) {
        state.filters.selectedPrice = state.filters.selectedPrice.filter(
          (p) => p !== price
        );
      } else {
        state.filters.selectedPrice.push(price);
      }
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.filters.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchQuery: "",
        selectedCategories: [],
        selectedPrice: [],
        sortBy: "",
      };
    },
  },
});

export const {
  setCourses,
  setActiveCourse,
  setSearchQuery,
  toggleCategoryFilter,
  togglePriceFilter,
  setSortBy,
  clearFilters,
} = courseSlice.actions;

export default courseSlice.reducer;
