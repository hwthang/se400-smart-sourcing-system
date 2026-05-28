Here is the completely rewritten commenting guide in English, optimized for clarity, professional tone, and scannability while preserving your original DDD + Clean Architecture structure.

---

# 📘 GUIDE-COMMENT.md

## Standard Commenting Guide for DDD + Clean Architecture

---

# 🎯 1. Objectives

This document establishes the code commenting standards across the project to ensure:

* **Improved Readability:** Code remains easy to navigate and understand for all team members.
* **Zero Noise:** Avoid cluttering the codebase with redundant text.
* **Maintainability & Debugging:** Accelerate troubleshooting and future extensions.
* **Consistency:** Standardize commenting patterns across all layers (Domain, Use Case, Repository, Controller).

---

# 🧱 2. General Principles

## ❌ DO NOT

* **Comment the obvious:** Avoid repeating what the code self-explainingly does.

```ts
// set username
this.username = username;

```

* **Be verbose:** Do not write long paragraphs that simply mimic the code logic.
* **Crutch commenting:** Do not use comments as a substitute for poor variable or function naming.

---

## ✅ DO

* **Explain the "WHY", not the "WHAT":** Focus on the business intent, not the syntax.
* **Use block formatting:** Group comments by logical steps.
* **Apply clear separators:** Visually isolate major logical transitions.
* **Document business rules & edge cases:** Highlight critical constraints and non-obvious behavior.

---

# 🧩 3. Standard Comment Block Formats

## ✔️ Standard Block

```ts id="comment_block"
// =========================================================
// 1. CHECK EMAIL EXISTENCE
// Purpose: Ensure email uniqueness before user creation
// =========================================================

```

---

## ✔️ Sub-block

```ts id="sub_block"
// -------------------------
// Validate input payload
// -------------------------

```

---

## ✔️ Inline Comment (Use Sparingly)

```ts id="inline"
const skip = (page - 1) * limit; // pagination offset calculation

```

---

# 🧠 4. Layer-Specific Commenting Rules

---

## 🧩 4.1 Domain Layer

### ❗ RULES

* Keep comments to an absolute minimum.
* Only document critical, invariant business rules.
* Never comment generic CRUD logic.

### ✔️ Example

```ts id="domain_comment"
// Prevent user from changing role after creation (business invariant)
updateRole(role: UserRole) {
  throw new Error("Role is immutable");
}

```

---

## 🧩 4.2 Use Case Layer (MOST IMPORTANT)

### ❗ RULES

* Fully document the execution flow.
* Clearly demarcate every step of the use case.
* Explicitly describe the business rules being enforced.

### ✔️ Standard Template

```ts id="usecase_comment"
// =========================================================
// 1. VALIDATE INPUT
// =========================================================

// =========================================================
// 2. CHECK BUSINESS RULES / INVARIANTS
// =========================================================

// =========================================================
// 3. PROCESS DATA / DOMAIN LOGIC
// =========================================================

// =========================================================
// 4. PERSIST DATA
// =========================================================

```

### ✔️ Real-World Example

```ts id="usecase_example"
// =========================================================
// 1. CHECK EMAIL EXISTENCE
// Prevent duplicate user registration
// =========================================================

```

---

## 🧩 4.3 Repository Layer

### ❗ RULES

* Keep comments lightweight.
* Explain the *purpose* of the query, not the database technology.
* Do not explain ORM/ODM syntax (e.g., Mongoose, Prisma, TypeORM).

### ✔️ Example

```ts id="repo_comment"
// Find user by unique identifier (either email or username)

```

---

## 🧩 4.4 Controller Layer

### ❗ RULES

* Strictly forbidden to include business logic comments here.
* Only document the request/response flow orchestration.

### ✔️ Example

```ts id="controller_comment"
// Delegate incoming request payload to the use case

```

---

# ⚙️ 5. Standard Comment Keywords

Use these standardized keywords consistently across the entire codebase:

| Keyword | Meaning / Application |
| --- | --- |
| **CHECK** | Validation, existence, or precondition checks |
| **VALIDATE** | Input data structure and payload validation |
| **PROCESS** | Core business logic and domain processing |
| **PERSIST** | Database operations (Save, Update, Delete) |
| **MAP** | Data transformation between layers (DTO/Entity/Mappers) |
| **RETURN** | Formulating and sending the final output/response |

---

# 🧠 6. Best Practice Flow Structure (Use Case)

## ✔️ Standard Flow Sequential Outline

```ts id="flow_comment"
// 1. VALIDATE INPUT
// 2. CHECK BUSINESS RULES
// 3. PROCESS DOMAIN LOGIC
// 4. CALL REPOSITORY (PERSIST)
// 5. RETURN RESULT

```

---

# 🚀 7. Full Use Case Blueprint Example

```ts id="full_example"
export class ExampleUseCase {
  async execute(dto: any) {
    // =========================================================
    // 1. VALIDATE INPUT
    // =========================================================
    
    // =========================================================
    // 2. CHECK EXISTING DATA / INVARIANTS
    // =========================================================
    
    // =========================================================
    // 3. APPLY BUSINESS LOGIC
    // =========================================================
    
    // =========================================================
    // 4. SAVE / PERSIST DATA
    // =========================================================
    
    // =========================================================
    // 5. RETURN RESULT
    // =========================================================
  }
}

```

---

# ⚠️ 8. Anti-patterns

## ❌ Bad (Vague & Redundant)

```ts
// check email

```

## ❌ Worse (Tells what the function name already says)

```ts
// this function creates user

```

---

## ✔️ Good (Explains Intent & Rule)

```ts
// Ensure email uniqueness before initiating the user creation pipeline

```

---

# 🧭 9. Rules of Thumb

> 💡 **The Deletion Test:** If a comment can be deleted and the code is still perfectly understood, that comment is redundant and should be removed.
> 💡 **The Business Value:** If a comment clarifies *why* a specific business rule exists in the real world, it is highly valuable and must be kept.

---

# 📌 10. Summary

* Comment to explain the **business reasoning** behind the code.
* Never comment self-explanatory or obvious code.
* Enforce the structured **Block Format** in all Use Cases.
* Maintain **minimal commenting** within the Domain Layer.
* Keep it clean, precise, and consistent across the entire project.