# 🎓 Nexura Hub

A modern, responsive, and full-featured **Learning Management System (LMS)** web application built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Redux Toolkit (RTK Query)**.

---

## 🌐 Live Demo

🔗 **Live URL:** [https://nexurahub.vercel.app/](https://nexurahub.vercel.app/)

---

## ✨ Key Features & Architecture Upgrades

- **⚛️ React 19 & Concurrent Features:** Fully upgraded to **React 19** and **react-redux v9** for superior rendering performance and concurrent features.
- **🔒 HttpOnly Cookie Security:** Secure HttpOnly, `SameSite=Strict` cookie authentication architecture (`credentials: 'include'`) replacing vulnerable client-side raw token storage.
- **⚡ RTK Query Integration:** Automatic server state caching, tag invalidation, background refetching, and pagination powered by `@reduxjs/toolkit/query/react`.
- **🛡️ Flicker-Free RBAC Route Guards:** Robust `<ProtectedRoute requiredRoles={['admin', 'instructor', 'student']}>` wrapper preventing UI flicker during state hydration on page hard refresh.
- **🎥 HLS Streaming & Anti-Piracy Watermark:** Adaptive Bitrate HLS (`.m3u8` via `hls.js`) video player with floating randomized anti-piracy student email/ID watermark, speed controls (0.5x–2x), Picture-in-Picture (PiP), keyboard shortcuts (Space, J/K/L, F, M), and timed personal notes/bookmarks.
- **🎓 Automated PDF Certificate Generator:** Verifiable completion certificate generator with Student Name, Course Title, Completion Date, Certificate ID, and embedded verification QR Code powered by HTML5 Canvas & jsPDF.
- **💬 Lesson Q&A Discussion Thread:** Interactive discussion forum embedded under each lesson for student questions, replies, upvotes, and instructor verification badges.
- **🔔 Real-Time Notification Center:** Header popover with unread counter badge and real-time event updates (live sessions, quiz feedback, replies).
- **🎫 Coupon & Discount Engine:** Admin and instructor promotional coupon manager (percentage/flat discounts, expiry date rules, max redemptions limit).
- **💳 Multi-Gateway Payment Checkout & PDF Invoice:** Seamless checkout supporting Stripe, SSLCommerz, and Shurjopay with instant itemized PDF invoice downloading.
- **📊 CSV Data Export:** One-click CSV financial ledger and student list export utility (`exportToCsv`).
- **🧪 Automated Testing & CI/CD:** Vitest unit & integration test runner, Playwright E2E testing framework, Sentry error tracking, and GitHub Actions CI workflow (`tsc --noEmit`, ESLint, Vitest).

---

## 👥 User Roles & Capabilities

Nexura Hub features **3 distinct user roles** with Role-Based Access Control (RBAC):

---

### 🎓 Student (User)

> Default role for registered users on the platform.

| Feature | Description |
|---|---|
| 🔍 Browse Courses | Search and filter all available courses by category, price, and keyword |
| 📄 View Course Details | Full curriculum outline, reviews, instructor profile, and promo pricing |
| 💳 Purchase Courses | Multi-gateway checkout (Stripe, SSLCommerz, Shurjopay), promo coupons, and PDF invoice downloads |
| 🎥 HLS Video Player | Adaptive streaming, speed controls (0.5x-2x), PiP, shortcuts, floating anti-piracy watermark |
| 🔖 Personal Notes | Bookmark key video timestamps with personal notes |
| 💬 Q&A Discussion | Post questions, reply to peers, upvote answers on lesson discussion threads |
| 🎓 PDF Certificate | Generate and download verified completion certificates with embedded QR codes |
| 📝 Interactive Quizzes | Attempt lesson-attached quizzes with instant scoring and feedback |
| ⭐ Leave Reviews | Rate and review completed courses |
| 👤 Manage Profile | Update personal details, avatar, and credentials |

---

### 🧑‍🏫 Instructor

> Can do everything a Student can, **plus** create, manage, and monetize courses.

| Feature | Description |
|---|---|
| ✅ All Student Features | Purchase, view, and test other courses |
| ➕ Create Courses | Add courses with metadata, category, thumbnail, and pricing |
| ✏️ Edit Courses | Update metadata, publish/unpublish, set promo pricing |
| 📦 Manage Modules | Add, reorder (drag & drop), and manage course modules |
| 🎬 Manage Lessons | Add video, text, resource, and quiz lessons |
| 🎫 Coupon Engine | Create promo discount codes with custom percentage/flat rules |
| 📡 Live Classes | Schedule, manage, and host live video sessions |
| 🧩 Quiz Sets | Build multiple-choice quiz sets attached to lessons |
| 👨‍🎓 View Enrollments | View student lists and course analytics |
| 📊 Instructor Dashboard | Monitor sales revenue, enrollments, and ratings |

---

### 🛡️ Admin (Super Admin)

> Full control over all platform operations, users, courses, and financial ledgers.

| Feature | Description |
|---|---|
| 📊 Platform Overview | View total GMV, 5% platform commission cut, net admin profits, total users, and growth charts |
| 🎫 Coupon Management | Full control over platform-wide promo coupons and discount rules |
| 📈 Financial Ledger & CSV | Detailed transaction histories with one-click **Export CSV** reporting |
| 📚 Manage All Courses | Publish/unpublish, feature on homepage, or delete any platform course |
| 👥 Manage All Users | View, suspend, activate, or change user roles (Student, Instructor, Admin) |
| 📄 CSV User Export | Export student and instructor lists directly into CSV spreadsheets |

---

## 🛠️ Tech Stack

| Category | Library / Tool |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| **State Management** | [Redux Toolkit 2.5](https://redux-toolkit.js.org/) + `react-redux v9` + **RTK Query** |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Video Streaming** | [hls.js](https://github.com/video-dev/hls.js/) (HLS Protocol) |
| **PDF & QR Generation** | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) + [QRCode](https://github.com/soldair/node-qrcode) |
| **Automated Testing** | [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/) + [Playwright](https://playwright.dev/) |
| **Observability** | [@sentry/react](https://sentry.io/) + Custom ErrorBoundary |
| **CI/CD Pipeline** | GitHub Actions (`.github/workflows/ci.yml`) |
| **Icons & UI** | [Lucide React](https://lucide.dev/) + [Recharts](https://recharts.org/) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **HTTP & Security** | [Axios](https://axios-http.com/) (HttpOnly Cookie Enabled) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/Rakibul12356/Nexura-Hub.git
cd Nexura-Hub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run automated test suite
```bash
npx vitest run
```

### 5. Build for production
```bash
npm run build
```

---

## 📂 Project Structure

```
Nexura-Hub/
├── .github/workflows/ci.yml         # GitHub Actions CI workflow (tsc, eslint, vitest)
├── vitest.config.ts                  # Vitest runner configuration
├── playwright.config.ts              # Playwright E2E configuration
├── vite.config.ts                    # Vite configuration
├── package.json                      # Dependencies (React 19, Redux 9, Vitest, etc.)
│
└── src/
    ├── main.tsx                      # React 19 app entry point
    ├── App.tsx                       # Redux Provider & RouterProvider
    │
    ├── api/                          # Axios instance with HttpOnly cookie support
    │   └── axiosInstance.ts          # Configured Axios instance (withCredentials: true)
    │
    ├── components/                   # UI Components
    │   ├── admin/                    # Admin components & CouponManager
    │   ├── common/                   # Shared UI, ProtectedRoute, CertificateGenerator, PaymentCheckoutModal, NotificationCenter, ErrorBoundary
    │   ├── dashboard/                # Instructor Studio dashboard components
    │   ├── player/                   # HlsPlayer, DynamicWatermark, PlayerNotes, LessonDiscussion
    │   └── ui/                       # Radix UI primitives
    │
    ├── lib/                          # Utilities (exportToCsv, sentry, formatPrice, confirmDelete)
    ├── pages/                        # Route pages (Auth, Main, Instructor, Admin, Player)
    ├── routes/                       # React Router v7 routes with ProtectedRoute RBAC guards
    │
    ├── store/                        # Centralized Redux Store & RTK Query
    │   ├── baseApi.ts                # RTK Query base setup with credentials: 'include'
    │   ├── api/                      # RTK Query endpoints (courseApi, quizApi, discussionApi, couponApi)
    │   └── slices/                   # Redux slices (authSlice, courseSlice, adminSlice, etc.)
    │
    ├── test/                         # Vitest unit & integration test files
    └── tests/e2e/                    # Playwright E2E test specs
```

---

## 🗺️ Route Map

| URL Pattern | Page | Access Guard |
|---|---|---|
| `/` | HomePage | Public |
| `/courses` | CoursesPage | Public |
| `/courses/:courseId` | CourseDetailPage | Public |
| `/inst-profile` | InstructorProfilePage | Public |
| `/enroll-success` | EnrollSuccessPage | Public |
| `/account` | AccountProfilePage | Protected (Student) |
| `/account/enrolled-courses` | EnrolledCoursesPage | Protected (Student) |
| `/login` | LoginPage | Guest |
| `/register` | RegisterPage | Guest |
| `/player/:courseSlug/:lessonId` | CoursePlayerPage | Protected (Student) |
| `/dashboard` | DashboardOverviewPage | Protected (Instructor/Admin) |
| `/dashboard/courses` | DashboardCoursesPage | Protected (Instructor/Admin) |
| `/dashboard/courses/add` | AddCoursePage | Protected (Instructor/Admin) |
| `/dashboard/lives` | DashboardLivesPage | Protected (Instructor/Admin) |
| `/dashboard/quiz-sets` | DashboardQuizSetsPage | Protected (Instructor/Admin) |
| `/admin` | AdminOverviewPage | Protected (Admin) |
| `/admin/courses` | AdminCoursesPage | Protected (Admin) |
| `/admin/users` | AdminUsersPage | Protected (Admin) |
| `/admin/revenue` | AdminRevenuePage | Protected (Admin) |

---

## 📄 License

This project is licensed under the MIT License.
