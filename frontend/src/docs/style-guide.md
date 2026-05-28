# 📘 PureBlue UI Style Guide (Tailwind CSS Production Edition)

## 🎯 Philosophy

PureBlue Production is a minimalist, high-performance UI system crafted for real-world production environments. By moving away from heavy borders, this system embraces a flat, borderless aesthetic that leverages Tailwind CSS utility classes to establish structure through unified `spacing`, direct user behavior via a focused `blue palette`, separate spatial layers using standard `shadows`, and deliver premium touchpoints with subtle `gradients`—all anchored by **Lucide Icons** as clean, functional signifiers.

---

## 🎨 Color & Gradient System (Tailwind Tokens)

Arbitrary color usage is strictly prohibited. Only use the following designated color tokens and gradient combinations to maintain global visual consistency:

### 1. Solid Colors

* **Primary Blue:** `bg-blue-800` | `text-blue-800` (Main actions, active states, and focal points).
* **Light Blue Accent:** `bg-blue-50` (Hover zones, highlighted blocks, and success notification backgrounds).
* **Typography Hierarchy:**
* Primary (Titles/Body/Data): `text-gray-900`
* Secondary (Subtitles/Placeholders/Meta-data): `text-gray-500`



### 2. Approved Gradients

* **Brand Gradient (`gradient-blue-solid`):** Reserved for high-priority Call-to-Actions (Primary CTAs) or critical status badges.
* *Tailwind Class:* `bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900`


* **Subtle Background Gradient (`gradient-blue-subtle`):** Used as a smooth background for dashboard containers to add elegant depth.
* *Tailwind Class:* `bg-gradient-to-br from-white to-blue-50/40`


* **Text Gradient (`gradient-text`):** Exclusively for large page titles (H1) or primary metric values on dashboards.
* *Tailwind Class:* `bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent`



---

## 📐 Spacing System (4px Base)

Layout and component spacing must strictly adhere to the following Tailwind spacing tokens:

* **4px (`p-1`, `m-1`, `gap-1`)** $\rightarrow$ Inline Gap: Separation between icons and text, or micro-elements positioned side-by-side.
* **8px (`p-2`, `m-2`, `gap-2`)** $\rightarrow$ Small Padding: Applied to compact buttons, tags, and tight table cells.
* **16px (`p-4`, `m-4`, `gap-4`)** $\rightarrow$ Default Padding / Component Spacing: Standard spacing for cards, content containers, and block gaps.
* **24px (`p-6`, `m-6`, `gap-6`)** $\rightarrow$ Section Spacing: Structural separation between major content regions on a page.
* **32px (`p-8`, `m-8`, `gap-8`)** $\rightarrow$ Page Spacing: Outer margins surrounding an entire page layout.

---

## 📱 Responsive Design Rules (Mobile-First Workflow)

The layout must transition fluidly across breakpoints using Tailwind's mobile-first prefixes (`sm:`, `md:`, `lg:`, `xl:`).

### 1. Screen Breakpoint Standards

* **Mobile (Default):** Baseline layouts optimized for single-column touch targets.
* **Tablet (`md:` $\rightarrow$ 768px):** Transition point for multi-column splits and navigation expansions.
* **Desktop (`lg:` $\rightarrow$ 1024px):** Standard data-dense presentation layouts.

### 2. Adaptive Layout Mechanics

* **Grid Controls:** Grid columns must scale adaptively to prevent narrow content squeezing.
* *Standard Card Grid:* `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`


* **Responsive Spacing:** Scale padding and gaps dynamically to maximize screen real estate on smaller devices.
* *Page Container Spacing:* `p-4 md:p-6 lg:p-8`
* *Component Spacing:* `gap-4 md:gap-6`


* **Typography Scaling:** Text elements must adapt proportionally to maintain visual hierarchy without breaking container bounds.
* *Main Metrics:* `text-xl md:text-2xl`
* *Section Headers:* `text-lg md:text-xl lg:text-2xl`



---

## 🧭 Layout Hierarchy & Corner Radius

This borderless structure relies entirely on spatial arrangement, responsive sizing, and rounding rules to shape a modern, clean, yet sharp production-ready user interface:

* **Block / Card Container / Button:** Uniformly locked at `rounded-md` (6px) to maintain a soft but crisp professional look.
* **Action Badges / Standalone Icons:** Allowed to use `rounded-full` for completely circular interactive utility elements.

---

## 🧱 Elevation & Shadow System (Spatial Layering)

Shadows are used to separate overlapping UI layers along the $Z$-axis. Only the following three elevation levels are permitted:

1. **Low Elevation (`shadow-sm`):** Applied to static flat structures such as data cards and form inputs.
2. **Medium Elevation (`shadow-md`):** Applied to the **Hover** state of cards/buttons, or structural elements fixed during scrolling (`sticky top-0 bg-white shadow-md`).
3. **High Elevation (`shadow-lg`):** Reserved for fully floating overlays such as dropdown menus, modal popups, and context menus (`absolute` or `fixed` paired with `z-50 shadow-lg`).

---

## 🧭 Lucide Icon Rules

To ensure professional visual harmony, all Lucide Icons must adhere strictly to these engineering parameters:

* **Stroke Width (`strokeWidth`):** Must always be set to `2` (or `stroke-[2]`). Avoid ultra-thin or overly thick weights that disrupt font rendering alignment.
* **Standard Sizes (`size`):**
* `size={16}` (Class: `w-4 h-4`) $\rightarrow$ Used inside form inputs, data tables, badges, or small text-aligned buttons.
* `size={20}` (Class: `w-5 h-5`) $\rightarrow$ Standard size for regular primary/secondary buttons and sidebar navigation items.
* `size={24}` (Class: `w-6 h-6`) $\rightarrow$ Exclusively for large standalone blocks, dashboard headers, or absolute-positioned modal close buttons.


* **Icon Coloring (`color/className`):** Icons do not carry independent colors. They must directly inherit their color from the adjacent parent text block (`text-gray-500`, `text-blue-800`, or `text-white`).

---

## 🧩 Component Tailwind Templates

### 1. Dashboard Metric Card (Adaptive Flat Block with Responsive Spacing)

```html
<div class="bg-white bg-gradient-to-br from-white to-blue-50/40 rounded-md p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md">
  <div class="flex items-center justify-between">
    <p class="text-xs md:text-sm font-medium text-gray-500">Total Allocated Value</p>
    <!-- Lucide Icon: TrendingUp (size={20}, color="blue-800") -->
    <svg class="w-5 h-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
  </div>
  <p class="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mt-1">
    125.50 ETH
  </p>
</div>

```

### 2. Premium Primary Button (Primary CTA with Leading Icon)

```html
<button class="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-4 py-2 md:px-5 md:py-2.5 rounded-md shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none w-full sm:w-auto">
  <!-- Lucide Icon: CreditCard (size={20}, color="white") -->
  <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
  <span class="text-sm md:text-base">Confirm Transaction</span>
</button>

```

### 3. Secondary Button (Flat Action Button)

```html
<button class="flex items-center justify-center gap-2 bg-white text-blue-800 font-medium px-4 py-2 md:px-5 md:py-2.5 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] disabled:opacity-40 w-full sm:w-auto">
  <span class="text-sm md:text-base">Cancel</span>
  <!-- Lucide Icon: ArrowRight (size={20}, color="blue-800") -->
  <svg class="w-5 h-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
</button>

```

### 4. Form Input (Flat Input with Responsive Sizing)

```html
<div class="relative w-full">
  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <!-- Lucide Icon: Search (size={16}, color="gray-500") -->
    <svg class="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  </div>
  <input 
    type="text" 
    class="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md pl-9 pr-3 py-2 md:py-2.5 text-sm md:text-base shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-800/20 transition-all"
    placeholder="Search wallet address (0x...)"
  />
</div>

```

---

## 🧱 States Management

Leverage Tailwind's state modifiers natively (`hover:`, `focus:`, `active:`, `disabled:`):

* **Hover State:** Elevate the shadow layout by exactly one tier (`hover:shadow-md`) to give components a distinct "lifted" feel. If a parent container updates its text color on hover (`hover:text-blue-800`), nested child icons will inherit this color shift naturally.
* **Focus State (Input):** Maintain a completely flat, clean background, while introducing a prominent focus ring overlay to anchor user attention (`focus:ring-4 focus:ring-blue-800/20`).
* **Disabled State:** Drop the opacity of the entire component wrapper—including icons—to standard inactive levels (`disabled:opacity-40 disabled:cursor-not-allowed`).

---

## 🚫 Restrictions

* **ABSOLUTELY NO** hardcoded screen sizes or arbitrary inline responsive widths. Use Tailwind's structural breakpoints (`sm:`, `md:`, `lg:`) exclusively.
* **ABSOLUTELY NO** purely decorative icons. Icons must only be used when they directly accompany and support actionable items or distinct data blocks.
* **NEVER** apply gradients to data entry components or transactional lists such as Form Inputs, Select Boxes, Checkboxes, or Table Rows. These components must retain solid, flat backgrounds (`bg-white` or `bg-gray-50`).
* **DO NOT** use non-standard shadows outside the explicit `shadow-sm`, `shadow-md`, and `shadow-lg` scale. Custom color glows or non-token shadow blur values are forbidden.
* **DO NOT** alter the border-radius footprint. Stick strictly to `rounded-md` (with the single exception of standalone circular action utility buttons using `rounded-full`).
* **DO NOT** center layout alignments indiscriminately. Adhere to `text-left` for standard copy, informational text, and data columns, while utilizing `text-right` exclusively for action headers or quantitative currency/numerical data columns within tables.