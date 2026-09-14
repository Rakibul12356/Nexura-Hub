# Nexura Hub - Full Project Analysis & Technical Documentation

> **Document Type:** Project Architectural & Functional Documentation  
> **Target Audience:** Team Lead, System Architect, Developers  
> **Project Name:** Nexura Hub (Next-Gen E-Learning & LMS Platform)  
> **Technology Stack:** React 19, TypeScript, Vite, Redux Toolkit, React Router v7, Tailwind CSS  

---

## 📋 Executive Summary (সংক্ষিপ্ত বিবরণ)

**Nexura Hub** হলো একটি আধুনিক, স্কেলএবল এবং ফিচার-সমৃদ্ধ **Learning Management System (LMS)** এবং ই-লার্নিং প্ল্যাটফর্ম। এটি ছাত্র, শিক্ষক (Instructor), এবং প্ল্যাটফর্ম এডমিন (Admin)-এর মধ্যে একটি সমন্বিত ইকোসিস্টেম গড়ে তোলে। 

এই প্ল্যাটফর্মে কোর্স ডিসকভারি, ভিডিও লেসন প্লেয়ার, কুইজ ইঞ্জিন, ডাইনামিক লাইভ ক্লাস সিডিউলিং, সার্টিফিকেট জেনারেশন, রিয়েল-টাইম কোর্স চ্যাট এবং এডমিনদের জন্য প্ল্যাটফর্ম রেভিনিউ হিসাব করার ৫% কমিশন কাটিং মেকানিজম রয়েছে।

---

## 🛠️ Technology Stack & Dependencies

| Category | Technologies / Libraries Used |
| :--- | :--- |
| **Core Framework** | React 19, TypeScript 5.4, Vite 5.2 |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit` 2.5), React Redux 9.2 |
| **Routing** | React Router DOM (`react-router-dom` 7.1) |
| **Styling & UI** | Tailwind CSS 3.4, Radix UI Primitives, Lucide Icons, Class Variance Authority (`cva`), `clsx`, `tailwind-merge` |
| **Form & Validation** | React Hook Form 7.51, Zod 3.23, `@hookform/resolvers` |
| **Drag & Drop** | `@hello-pangea/dnd` 16.6 |
| **Media & Analytics** | HLS.js (Video Streaming), Recharts 2.12 (Data Visualization) |
| **Certificate & Export** | HTML2Canvas 1.4, jsPDF 2.5, QRCode 1.5 |
| **Notifications & UI Effects** | React Toastify, Sonner, SweetAlert2 |
| **Testing & Quality** | Vitest 2.1, Testing Library, Playwright |

---

## 👥 User Roles & Permission Matrix (ইউজার রোল এবং পারমিশন)

Nexura Hub প্ল্যাটফর্মে প্রধানত **৩টি ইউজার রোল (User Roles)** রয়েছে:

1. 🎓 **Student (ছাত্র)**
2. 👨‍🏫 **Instructor (শিক্ষক)**
3. 🛡️ **Admin (প্ল্যাটফর্ম সুপারএডমিন)**

### 📊 Role-Based Feature Access Matrix

| Feature / Module | Student (ছাত্র) | Instructor (শিক্ষক) | Admin (এডমিন) |
| :--- | :---: | :---: | :---: |
| **Browse & Search Courses** | ✅ | ✅ | ✅ |
| **Enroll in Courses (Payment)** | ✅ | ✅ | ❌ |
| **Watch Lessons & Track Progress** | ✅ | ✅ | ❌ |
| **Take Lesson Quizzes & Get Scores** | ✅ | ✅ | ❌ |
| **Download Certificate of Completion** | ✅ | ✅ | ❌ |
| **Participate in Lesson Discussions** | ✅ | ✅ | ❌ |
| **Use Real-time Chat & Group Messaging** | ✅ | ✅ | ❌ *(Disabled for Admin)* |
| **Access Instructor Studio (`/dashboard`)** | ❌ | ✅ | ✅ |
| **Create & Edit Courses & Modules** | ❌ | ✅ | ❌ |
| **Create & Manage Quiz Sets** | ❌ | ✅ | ❌ |
| **Schedule Live Classes** | ❌ | ✅ | ❌ |
| **View Course Student Enrollments & Reviews** | ❌ | ✅ | ❌ |
| **Access Admin Control Hub (`/admin`)** | ❌ | ❌ | ✅ |
| **Approve / Reject Pending Courses** | ❌ | ❌ | ✅ |
| **Manage Users (Suspend / Role Change / Approve)** | ❌ | ❌ | ✅ |
| **Track Platform GMV & 5% Admin Revenue Cut** | ❌ | ❌ | ✅ |

---

### 🔍 Detailed Breakdown per Role (প্রতিটি রোলের বিস্তারিত ক্ষমতা)

#### 1. 🎓 Student Role (ছাত্র রোল)
- **কোর্স ডিসকভারি:** ক্যাটাগরি, দাম, রেটিং, এবং ফিল্টারিং এর মাধ্যমে কোর্স খোঁজা।
- **এনরোলমেন্ট:** সিলেক্টেড কোর্সে চেকআউট মোডালের (bKash, Nagad, Card) মাধ্যমে এনরোল করা।
- **লার্নিং প্লেয়ার:** কোর্স লেসন দেখা, লেসন কমপ্লিট চিহ্নিত করা, কোর্স রিসোর্স ডাউনলোড করা (PDF, GitHub links)।
- **কুইজ ও ডিসকাশন:** লেসন ভিত্তিক কুইজ দেওয়া এবং লেসনের নিচে প্রশ্ন-উত্তর ও কমেন্ট করা।
- **সার্টিফিকেট ജেনারেশন:** কোর্স ১০০% শেষ হলে অটোমেটিক ডায়নামিক PDF সার্টিফিকেট ডাউনলোড ও QR ভ্যালিডেশন করা।
- **চ্যাট ও কমিউনিটি:** ইন্সট্রাক্টরের সাথে ১-অন-১ প্রাইভেট চ্যাট এবং এনরোল করা কোর্সের স্টুডেন্ট গ্রুপ চ্যাটে কথা বলা।
- **প্রোফাইল ম্যানেজমেন্ট:** ব্যক্তিগত তথ্য আপডেট করা এবং এনরোল করা কোর্সগুলোর অগ্রগতি দেখা।

#### 2. 👨‍🏫 Instructor Role (শিক্ষক রোল)
- **ইনস্ট্রাক্টর স্টুডিও (`/dashboard`):** মোট আয় (95% cut), মোট স্টুডেন্ট, একটিভ কোর্স এনরোলমেন্ট এবং পারফর্মেন্স অ্যানালিটিক্স দেখা।
- **কোর্স বিল্ডার:** ড্র্যাগ-অ্যান্ড-ড্রপ সুবিধা সহ কোর্স, মডিউল, লেসন এবং ভিডিও আপলোড/লিঙ্ক করা।
- **কুইজ সেট ম্যানেজার:** কুইজ সেট তৈরি করা, পয়েন্ট সেট করা এবং প্রশ্ন ও বিকল্প যোগ করা।
- **লাইভ ক্লাস সিডিউলার:** সরাসরি জুম বা ইউটিউব লাইভ স্ট্রিমিং লিঙ্ক সিডিউল করা।
- **রিভিউ ও এনরোলমেন্ট মনিটরিং:** নিজের কোর্সে এনরোল হওয়া স্টুডেন্টদের তালিকা ও তাদের দেওয়া রিভিউ দেখা ও উত্তর দেওয়া।
- **স্টুডেন্টদের সাথে চ্যাট:** স্টুডেন্টদের প্রশ্নের সরাসরি উত্তর দেওয়া ও কোর্স গ্রুপে যুক্ত থাকা।

#### 3. 🛡️ Admin Role (এডমিন রোল)
- **এডমিন কন্ট্রোল হাব (`/admin`):** পুরো প্ল্যাটফর্মের ওভারভিউ, মোট জিএমভি (GMV), ইউজার ও কোর্স সংখ্যা দেখা।
- **কোর্স মডারেশন ও অনুমোদন:** ইনস্ট্রাক্টরদের তৈরি করা কোর্স রিভিউ করা এবং পাবলিশ (Approve) বা রিজেক্ট করা।
- **ইউজার ম্যানেজমেন্ট:** প্ল্যাটফর্মের সকল স্টুডেন্ট ও ইনস্ট্রাক্টরদের একাউন্ট স্ট্যাটাস (Active, Suspended, Pending) ম্যানেজ করা, নতুন ইনস্ট্রাক্টর এপ্রুভ করা ও রোল পরিবর্তন করা।
- **রেভিনিউ ও ৫% কমিশন কাটিং:** 
  - ইনস্ট্রাক্টরের কোর্সের আয়ের **৯৫% ইনস্ট্রাক্টর** পাবে এবং **৫% এডমিন কমিশন** পাবে।
  - এডমিনের নিজের তৈরি কোর্সের **১০০% রেভিনিউ** এডমিনের ঝুলিতে জমা হবে।
  - ট্রান্সজেকশন হিস্ট্রি ও পেআউট রিপোর্ট দেখা।
- **নো চ্যাট এক্সেস:** সিস্টেম নিয়মানুযায়ী এডমিনদের জন্য চ্যাট আইকন বা চ্যাট ফিচার সম্পূর্ণরূপে বন্ধ ও হাইড রাখা হয়েছে।

---

## 📁 Directory & Folder Structure (ফোল্ডার স্ট্রাকচার)

```
c:\Users\rakib\Nexura-Hub\
├── public/                     # Static public assets (logos, favicon, sample images)
├── src/                        # Main Application Source Code
│   ├── api/                    # API client configurations (Axios instances, base URLs)
│   ├── assets/                 # SVGs, static image assets, branding graphics
│   ├── components/             # Reusable UI & Logical Components
│   │   ├── admin/              # Admin dashboard specific components (charts, user table)
│   │   ├── chat/               # Real-time chat system components (ChatSidebar, ChatWindow, CreateGroupModal)
│   │   ├── common/             # Global shared components (Navbar, Footer, ProtectedRoute, NotificationCenter)
│   │   ├── dashboard/          # Instructor dashboard layout & navigation components
│   │   ├── player/             # Course player elements (LessonDiscussion, CourseSidebar, QuizModal)
│   │   └── ui/                 # Atomic Shadcn/Radix UI base primitives (Button, Dialog, Input, Dropdown)
│   ├── hooks/                  # Custom React Hooks (e.g., useLockBody, useAppSelector, useAppDispatch)
│   ├── layouts/                # Wrapper Layout Components with Outlet routing
│   │   ├── AccountLayout.tsx   # Layout for /account pages
│   │   ├── AdminLayout.tsx     # Admin specific container
│   │   ├── AuthLayout.tsx      # Login/Register centered container
│   │   ├── DashboardLayout.tsx # Sidebar + Header layout for Instructor/Admin dashboard
│   │   ├── MainLayout.tsx      # Public website layout (Header + Content + Footer)
│   │   ├── PlayerLayout.tsx    # Full-screen learning player layout
│   │   └── RootLayout.tsx      # Top-level React Toastify & Error Boundary wrapper
│   ├── lib/                    # Helper utilities (formatPrice, utils, cn)
│   ├── pages/                  # Page Views (Lazy-Loaded Components)
│   │   ├── admin/              # Admin Pages (AdminOverviewPage, AdminCoursesPage, AdminUsersPage, AdminRevenuePage)
│   │   ├── auth/               # Auth Pages (LoginPage, RegisterPage)
│   │   ├── instructor/         # Instructor Pages (Overview, Add/Edit Course, EditModule, Lives, QuizSets)
│   │   ├── main/               # Public Pages (HomePage, CoursesPage, CourseDetailPage, InstructorProfile, ChatPage)
│   │   │   └── account/        # Student Account Pages (AccountProfilePage, EnrolledCoursesPage)
│   │   └── player/             # Learning Video Player Page (CoursePlayerPage)
│   ├── routes/                 # Application Routing Configuration (createBrowserRouter definition)
│   │   └── index.tsx           # Route mapping with ProtectedRoute & Lazy-loading fallback
│   ├── services/               # API Data Services & Business Logic Mock Layer
│   ├── store/                  # Redux Toolkit Global State Management
│   │   ├── index.ts            # Redux store config & root reducer
│   │   ├── hooks.ts            # Typed hooks (useAppDispatch, useAppSelector)
│   │   └── slices/             # Feature-based Redux Slices
│   │       ├── adminSlice.ts   # Admin management, statistics, 5% revenue cut, user actions
│   │       ├── authSlice.ts    # Authentication state, current user, login/logout actions
│   │       ├── chatSlice.ts    # Direct & Group conversations, unread messages, auto-join
│   │       ├── courseSlice.ts  # Courses list, search, filter, enrollment, reviews
│   │       ├── dashboardSlice.ts # Instructor dashboard stats, course CRUD, live classes
│   │       └── uiSlice.ts      # Theme settings, sidebar status, modal toggles
│   ├── types/                  # TypeScript Data Models & Type Definitions
│   │   ├── admin.ts            # AdminStats, PlatformTransaction, ManagedUser
│   │   ├── auth.ts             # User, Role ("student" | "instructor" | "admin"), AuthState
│   │   ├── chat.ts             # ChatUser, ChatMessage, ChatConversation
│   │   ├── common.ts           # NavItem, Component standard props
│   │   ├── course.ts           # Course, Module, Lesson, QuizSet, EnrolledCourse
│   │   └── dashboard.ts        # DashboardStats, InstructorAnalytics
│   ├── App.tsx                 # Root application wrapper
│   ├── index.css               # Global CSS & Tailwind Utilities
│   ├── main.tsx                # React DOM render entry point
│   └── vite-env.d.ts           # Vite environment definitions
├── package.json                # Project dependencies & npm scripts
├── tailwind.config.js          # Tailwind styling rules, theme extensions, animations
├── tsconfig.json               # TypeScript compiler config & path aliases (@/*)
└── vite.config.ts              # Vite bundler plugins & dev server setup
```

---

## 🗺️ Routes & Pages Map (সকল রাউটস এবং পেজের বিস্তারিত তালিকা)

নিচে অ্যাপ্লিকেশনের সমস্ত রাউট ও পেজগুলোর তালিকা দেওয়া হলো:

### 1. 🌐 Public & General Routes (সবার জন্য উন্মুক্ত)

| Route Path | Component Page | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | হিরো ব্যানার, ফিচার্ড কোর্স, প্ল্যাটফর্ম স্ট্যাটস, টেস্টিকমোনিয়াল এবং FAQ | Public |
| `/courses` | `CoursesPage` | কোর্স ক্যাটালগ, ফিল্টারিং (Category, Price), সার্চ এবং সোর্টিং | Public |
| `/courses/:courseId` | `CourseDetailPage` | কোর্সের বর্ণনা, আউটলাইন, ইনস্ট্রাক্টর প্রোফাইল, রিভিউ এবং এনরোল বাটন | Public |
| `/inst-profile` | `InstructorProfilePage` | ইনস্ট্রাক্টরের বায়ো, অর্জন এবং তার কোর্সসমূহের তালিকা | Public |
| `/enroll-success` | `EnrollSuccessPage` | সফল কোর্স কেনাকাটার পর কনফার্মেশন ও লার্নিং লিংক | Authenticated |
| `/login` | `LoginPage` | লগইন ফর্ম (ডেমো ইউজার এক-ক্লিকে টেস্ট করার বাটন সহ) | Guest |
| `/register` | `RegisterPage` | স্টুডেন্ট অথবা ইনস্ট্রাক্টর হিসেবে রেজিস্ট্রেশন | Guest |

---

### 2. 🎒 Student & Account Routes (লগইন করা স্টুডেন্ট ও ইউজার)

| Route Path | Component Page | Description | Access |
| :--- | :--- | :--- | :--- |
| `/messages` | `ChatPage` | ১-অন-১ ইনবক্স ও কোর্স গ্রুপ চ্যাট সিস্টেম | Student, Instructor *(Admin Blocked)* |
| `/account` | `AccountProfilePage` | প্রোফাইল এডিট, পাসওয়ার্ড পরিবর্তন এবং পছন্দসমূহ | Protected (`/account`) |
| `/account/enrolled-courses` | `EnrolledCoursesPage` | এনরোল করা কোর্সের তালিকা, অগ্রগতি ও সার্টিফিকেট লিংক | Protected (`/account`) |

---

### 3. 📺 Course Learning Player Routes (কোর্স লেসন প্লেয়ার)

| Route Path | Component Page | Description | Access |
| :--- | :--- | :--- | :--- |
| `/player/:courseSlug/:lessonId` | `CoursePlayerPage` | ফুল-স্ক্রিন স্ট্রিমিং প্লেয়ার, মডিউল সিলেক্টর, কুইজ মোডাল, লেসন কমপ্লিশন এবং সার্টিফিকেট ডায়ালগ | Protected (Enrolled Student) |

---

### 4. 👨‍🏫 Instructor Studio Dashboard Routes (শিক্ষক স্টুডিও)

| Route Path | Component Page | Description | Access |
| :--- | :--- | :--- | :--- |
| `/dashboard` | `DashboardOverviewPage` | ইনস্ট্রাক্টরের মোট আয়, সক্রিয় ছাত্র, কোর্স সেলস চার্ট | Instructor, Admin |
| `/dashboard/courses` | `DashboardCoursesPage` | তৈরি করা কোর্সের তালিকা, পাবলিশ স্ট্যাটাস ও একশন | Instructor, Admin |
| `/dashboard/courses/add` | `AddCoursePage` | নতুন কোর্স তৈরির উইজার্ড | Instructor, Admin |
| `/dashboard/courses/:courseId` | `EditCoursePage` | কোর্সের বিস্তারিত, দাম ও মডিউল ম্যানেজমেন্ট | Instructor, Admin |
| `/dashboard/courses/:courseId/modules/:moduleId` | `EditModulePage` | মডিউল ও লেসন ড্র্যাগ-অ্যান্ড-ড্রপ রিঅর্ডার, ভিডিও ও কুইজ লিংক | Instructor, Admin |
| `/dashboard/courses/:courseId/enrollments` | `CourseEnrollmentsPage` | 특정 কোর্সে ভর্তি হওয়া ছাত্রদের তালিকা | Instructor, Admin |
| `/dashboard/courses/:courseId/reviews` | `CourseReviewsPage` | ছাত্রদের দেওয়া রিভিউ ও ফিডব্যাক দেখার পেজ | Instructor, Admin |
| `/dashboard/lives` | `DashboardLivesPage` | শিডিউল করা লাইভ ক্লাসের তালিকা | Instructor, Admin |
| `/dashboard/lives/add` | `AddLivePage` | নতুন লাইভ ক্লাস তৈরি ও ইউটিউব/জুম স্ট্রিম লিঙ্ক যুক্ত করা | Instructor, Admin |
| `/dashboard/lives/:liveId` | `EditLivePage` | লাইভ ক্লাসের তথ্য এডিট করা | Instructor, Admin |
| `/dashboard/quiz-sets` | `DashboardQuizSetsPage` | কুইজ সেটের তালিকা ম্যানেজমেন্ট | Instructor, Admin |
| `/dashboard/quiz-sets/add` | `AddQuizSetPage` | নতুন কুইজ সেট তৈরি ও মার্ক্স সেট করা | Instructor, Admin |
| `/dashboard/quiz-sets/:quizSetId` | `EditQuizSetPage` | কুইজের প্রশ্ন ও অপশন যোগ/সম্পাদনা করা | Instructor, Admin |
| `/dashboard/messages` | `ChatPage` | ইনস্ট্রাক্টর ভিউ স্টুডেন্ট চ্যাট ও কোর্স মেসেজ | Instructor *(Admin Blocked)* |

---

### 5. 🛡️ Admin Control Hub Routes (এডমিন সুপারএডমিন কন্ট্রোল)

| Route Path | Component Page | Description | Access |
| :--- | :--- | :--- | :--- |
| `/admin` | `AdminOverviewPage` | পুরো প্ল্যাটফর্মের GMV, এডমিন নেট ৫% রেভিনিউ, গ্রোথ চার্ট | Admin Only |
| `/admin/courses` | `AdminCoursesPage` | ইনস্ট্রাক্টরদের কোর্স অনুমোদন (Approve/Reject) ও পাবলিশ ম্যানেজমেন্ট | Admin Only |
| `/admin/users` | `AdminUsersPage` | প্ল্যাটফর্মের সকল ইউজারের তালিকা, স্ট্যাটাস চেঞ্জ (Active/Suspended/Pending) ও রোল চেঞ্জ | Admin Only |
| `/admin/revenue` | `AdminRevenuePage` | প্ল্যাটফর্মের ৫% কমিশন এবং ইনস্ট্রাক্টর ৯৫% পেআউটের বিস্তারিত ফাইন্যান্সিয়াল হিস্ট্রি | Admin Only |

---

## ⚡ Core Feature Details (প্রধান ফিচারসমূহের বর্ণনা)

### 1. 💳 Payment & Auto Group Join (পেমেন্ট ও অটো চ্যাট গ্রুপ)
- ছাত্ররা ডমি পেমেন্ট সিস্টেমের (bKash, Nagad, Card) মাধ্যমে কোর্সে এনরোল হতে পারে।
- এনরোলমেন্ট সফল হওয়ামাত্র `chatSlice`-এর `autoJoinCourseGroupOnEnroll` ট্র্রিগার হয়, যা স্টুডেন্টকে ওই কোর্সের চ্যাট গ্রুপে সদস্য বানিয়ে দেয়।

### 2. 🎓 Dynamic Certificate Generation (সার্টিফিকেট জেনারেটর)
- যখন একজন শিক্ষার্থী কোনো কোর্সের ১০০% লেসন সম্পন্ন করে, প্লেয়ারের ভেতর সার্টিফিকেট বাটন সচল হয়।
- এটি শিক্ষার্থীর নাম, কোর্স শিরোনাম, সমাপ্তির তারিখ এবং একটি ইউনিক ভেরিফিকেশন QR কোড সহ সুন্দর PDF সার্টিফিকেট তৈরি করে দেয় (HTML2Canvas ও jsPDF ব্যবহার করে)।

### 3. 📊 Admin 5% Platform Revenue Cut Model (এডমিন ৫% রেভিনিউ লজিক)
- **ইনস্ট্রাক্টর কোর্স:** বিক্রি হওয়া প্রতিটি ইনস্ট্রাক্টর কোর্সের **৯৫% যায় ইনস্ট্রাক্টরের ঝুলিতে** এবং **৫% প্ল্যাটফর্ম ফি** হিসেবে এডমিনের আয়ে যোগ হয়।
- **এডমিন কোর্স:** এডমিন যদি নিজে কোনো কোর্স তৈরি করেন, তবে তার **১০০% আয় এডমিন এডমিন অ্যাকাউন্টে** জমা হয়।
- `adminSlice.ts`-এ এই হিসাবগুলো রিয়েল-টাইমে ক্যালকুলেট করা হয়।

### 4. 💬 Real-time Messaging System (WebSocket Client Integration)
- **`socket.io-client` ও `useSocket` Hook Integration:** রিয়েল-টাইম ১-অন-১ চ্যাট, ইনস্ট্যান্ট মেসেজ ডেলিভারি, এবং অটো-রিকানেকশন।
- **Typing Indicator & Live Status:** ইউজারের লাইভ টাইপিং স্ট্যাটাস (`"User is typing..."`) এবং অনলাইন/অফলাইন স্ট্যাটাস ডাইনামিকালি আপডেট হয়।
- **Message Emoji Reactions (ইমোজি রিঅ্যাকশন):** মেসেজে হোভার করলে দ্রুত ইমোজি রিঅ্যাকশন (👍, ❤️, 😂, 😮, 😢, 🔥) দেওয়া ও টগল করার সুবিধা এবং রিয়েল-টাইম রিঅ্যাকশন কাউন্টার পিলস।
- **Fallback Simulation:** ব্যাকএন্ড সকেট সার্ভার না থাকা সত্ত্বেও ক্লায়েন্ট অ্যাপ এ কোনো ক্র্যাশ ছাড়াই ফুল-ফাংশনাল লোকাল চ্যাট ও অটো-রেসপন্স হ্যান্ডেল করে।
- **এডমিন সিকিউরিটি নীতি:** এডমিন রোল চ্যাট সিস্টেম থেকে সম্পূর্ণ মুক্ত রাখা হয়েছে।

---

## 👨‍💻 Note for Team Leader (টিম লিডারের উদ্দেশ্যে)

> **Hello Leader,**  
> এই প্রজেক্টটি একটি প্রোডাকশন-রেডি, টাইপ-সেফ এবং অত্যন্ত মডিউলার আর্কিটেকচারে তৈরি করা হয়েছে। 
> - **Redux Toolkit** দিয়ে সেন্ট্রালাইজড স্টেট ম্যানেজমেন্ট করা হয়েছে।
> - **React Router v7** দিয়ে রোল-ভিত্তিক `ProtectedRoute` মেকানিজম বাস্তবায়ন করা হয়েছে।
> - **Vite + React 19** ব্যবহারের ফলে পেজ লোডিং ও বিল্ড স্পিড অত্যন্ত দ্রুত।
> - সকল পেজ ও কম্পোনেন্ট responsive এবং Tailwind CSS এর মাধ্যমে পিক্সেল পারফেক্ট ডিজাইন করা।

---
*Created & Documented for Nexura Hub Repository.*
