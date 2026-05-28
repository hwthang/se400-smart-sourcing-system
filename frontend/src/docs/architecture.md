Dưới đây là bản **rút gọn + chuẩn English + dễ đọc cho team**:

```md id="frontend_arch_short"
# Frontend Architecture Guide

## 🎯 Overview

This project follows a **layered + feature-based architecture** with the goals:

- Easy scalability by domain (customer, order, supplier, etc.)
- Clear separation of UI, business logic, and infrastructure
- Reduced module coupling

---

## 🧱 Architecture Structure

The frontend is divided into 4 main layers:

- **app/** → application bootstrap (composition root)
- **core/** → infrastructure layer
- **features/** → business modules (domain)
- **shared/** → reusable components & utilities

---

## 📦 1. App Layer

**Responsibilities:**
- App initialization
- Routing
- Layout system
- Providers setup

**Contains:**
- layouts/
- routes/
- providers/
- App.tsx

**Rules:**
- No business logic
- No direct API calls
- Only compose features

---

## ⚙️ 2. Core Layer

**Responsibilities:**
- External system integration
- API client
- Environment config
- Query client setup

**Contains:**
- api/
- config/
- query-client/

**Rules:**
- No UI code
- No React components
- Only infrastructure logic

---

## 🧩 3. Features Layer

**Responsibilities:**
- Each feature represents a domain module

**Structure:**
```

feature/
pages/
components/
hooks/
services/
types/
routes.tsx

```

**Rules:**
- No cross-feature imports
- Business logic in hooks/services
- Keep UI clean and simple

---

## ♻️ 4. Shared Layer

**Responsibilities:**
- Reusable code across the system

**Contains:**
- ui/
- hooks/
- types/

**Rules:**
- No business logic
- Must be generic and reusable

---

## 🔄 Data Flow

```

UI → Hook → Service → API Client → Backend

```

---

## 🚫 Rules

- No API calls inside components
- No cross-feature imports
- No business logic inside UI

✅ Always move logic to hooks/services
```