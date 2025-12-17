# FlashIQ — React + TypeScript + Vite

A Flashcard frontend application built with **React**, **TypeScript**, and **Vite**. This repository follows a clean, layered architecture and provides clear setup steps so anyone can clone and run the project quickly.

---

## 🧩 Tech Stack

* **React 19** + **TypeScript**
* **Vite** (fast dev server & build)
* **Tailwind CSS v4** (utility-first styling)
* **React Router** (client-side routing)
* **ESLint** (code quality)
* **Husky** (Git hooks – optional)

---

## 📁 Project Structure (Layer Architecture)

```txt
src/
├── components/        # Reusable UI components
│   ├── common/
│   └── ui/
├── pages/             # Page-level components
├── layouts/           # App layouts
├── routes/            # Route definitions
├── services/          # API / data layer
├── store/             # Global state management
├── hooks/             # Custom React hooks
├── utils/             # Helper utilities
├── constants/         # Application constants
├── types/             # TypeScript types & interfaces
├── App.tsx            # Root application component
├── main.tsx           # Application entry point
└── index.css          # Global styles (Tailwind entry)
```

---

## ⚡ Quick Start (for experienced users)

```bash
git clone <REPOSITORY_URL>
cd FlashIQ
npm install
npm run dev
```

Open: **[http://localhost:5173](http://localhost:5173)**

---

## 📝 Step-by-step Setup (Beginner-friendly)

### 1️⃣ Install Required Tools

* **Node.js v18 or later**

```powershell
node -v
npm -v
```

* **Git** (recommended)

```powershell
git --version
```

---

### 2️⃣ Clone the Repository

```powershell
git clone <REPOSITORY_URL>
cd FlashIQ
```

> If you don’t use Git, download the ZIP from GitHub, extract it, and open the project folder.

---

### 3️⃣ Install Dependencies

```powershell
npm install
```

---

### 4️⃣ Environment Variables (Optional)

Create a **.env** file in the project root if the app needs to connect to a backend API:

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

### 5️⃣ Verify Tailwind CSS Setup

Ensure **src/index.css** contains:

```css
@import "tailwindcss";
```

> ⚠️ Tailwind CSS v4 **does not use** `@tailwind base`, `@tailwind components`, or `@tailwind utilities`.

---

### 6️⃣ Run the Project

```powershell
npm run dev
```

Open your browser at:

```
http://localhost:5173
```

Quick Tailwind test:

```tsx
<h1 className="text-4xl font-bold text-red-500">Tailwind OK 🚀</h1>
```

If the text appears large and red, Tailwind is working correctly.

---

## 🛠️ Common Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🧹 Troubleshooting

### ❌ Tailwind CSS Not Working

1. Make sure dependencies are installed:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

2. Check **vite.config.ts**:

```ts
import tailwindcss from "@tailwindcss/vite";

plugins: [react(), tailwindcss()];
```

3. Restart the dev server:

```bash
Ctrl + C
npm run dev
```