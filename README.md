# 🎓 Nexura-Hub (EduConnect LMS)

A modern, responsive, and full-featured Learning Management System (LMS) web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Redux Toolkit**.

---

## 🌐 Live Demo

🔗 **Live URL:** [https://nexurahub.vercel.app/](https://nexurahub.vercel.app/)

---

## ✨ Features

- **🏠 Interactive Landing Page:** Beautiful hero section, featured courses, category browsing, testimonials, and FAQ.
- **📚 Course Browsing & Details:** Advanced search, category filters, detailed course curriculum outline, pricing, reviews, and instructor info.
- **🎥 Immersive Video & Lesson Player:** Smooth learning experience with interactive curriculum navigation, lesson progress tracking, and materials.
- **📊 Instructor & Admin Dashboard:**
  - Performance overview, student stats, and revenue analytics.
  - Course creation & management with drag-and-drop module organization.
  - Live session scheduler and management.
  - Quiz sets creation and assessments.
- **🔐 Authentication & User Roles:** Role-based access (Student, Instructor, Admin) with secure sign-in, registration, and profile management.
- **🎨 Modern UI/UX:** Designed with Radix UI components, Lucide Icons, smooth transitions, and responsive Tailwind CSS layout.
- **⚡ State Management:** Robust centralized state management powered by Redux Toolkit.

---

## 🛠️ Tech Stack

- **Frontend:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) + `react-redux`
- **Routing:** [React Router](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Drag & Drop:** [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Deployment:** [Vercel](https://vercel.com/)

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

### 3. Start the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for production
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

---

## 📂 Project Structure

```text
src/
├── assets/          # Static assets & images
├── components/      # Reusable UI components & layouts
├── hooks/           # Custom React hooks
├── layouts/         # Dashboard & Main layout wrappers
├── lib/             # Utility functions & helpers
├── pages/           # Application views
│   ├── auth/        # Sign in, Sign up, Password recovery
│   ├── dashboard/   # Instructor & Admin dashboard pages
│   ├── main/        # Landing, Course catalog, Details, Profile
│   └── player/      # Course video & lesson player
├── routes/          # Application routing configuration
├── services/        # API services and network requests
├── store/           # Redux Toolkit store & slices
└── types/           # TypeScript interfaces & type definitions
```

---

## 📄 License

This project is licensed under the MIT License.
