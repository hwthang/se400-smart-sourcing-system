# SE400 Sourcing System - Frontend

A modular, feature-based React application focused on supply chain management, utilizing the **WireBorder** design philosophy.

## 🚀 Tech Stack
* **Core:** React 18 + TypeScript + Vite
* **Data Fetching:** React Query
* **Architecture:** Feature-based Layered Design

---

## 🧱 Architecture
The project is organized into four distinct layers:

* **`src/app`**: App bootstrap (Routes, Providers, Global Layouts).
* **`src/core`**: Infrastructure (Axios instance, Auth logic, Global config).
* **`src/features`**: Domain modules (Auth, Orders, Suppliers, Customers).
* **`src/shared`**: Reusable UI (WireBorder components), Hooks, and Utils.

---

## 🎨 WireBorder UI System
A minimalist design system where **Structure > Decoration**.
* **Principles:** UI is built strictly using **Border + Spacing + Typography**.
* **Forbidden:** No shadows, no gradients, no decorative icons, and no colors (except for status indicators: Success/Error).

---

## 📁 Feature Structure
Each domain in `src/features/` must be self-contained:
```text
feature-name/
├── components/  # Local UI components
├── hooks/       # React Query logic (useX)
├── services/    # API calls & Data schemas
├── types/       # Domain types
└── index.ts     # Public API for the feature
```

---

## 🚫 Development Rules
1.  **Separation of Concerns:** Business logic belongs in `hooks/services`, never in UI components.
2.  **Isolation:** Features cannot import from other features. Use `shared` for common logic.
3.  **Data Flow:** `UI` → `Hook` → `Service` → `API Client`.

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
