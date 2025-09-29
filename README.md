# 📊 Matrix Table App — Frontend React Test Task

A React + TypeScript application that generates and visualizes an **M × N matrix** with advanced interactivity:
- Increment cell values  
- Highlight **X nearest** cells by value  
- Show row **percentages** + **row heatmap** on hover  
- Add/remove rows dynamically  
- Strict **input validation** with clear UX  

---

## Table of Contents
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Getting Started](#-getting-started)
- [🌐 Deployment](#-deployment)

---

## 🚀 Features

- **Inputs & Validation**
  - `M` and `N` in **0–100**
  - `X` in **0–(M×N−1)**
  - Numeric-only input; invalid → **red border** + **toast**

- **Data Table**
  - Cells: `{ id, amount }` (3-digit random)
  - Extra **Sum** column (per row)
  - Extra **60th percentile** row (per column)
  - Hover cell → highlight **X nearest**
  - Click cell → `+1`
  - Hover row sum → **% of total** + **row heatmap**

- **Row Management**
  - `+ Add row` / `× Remove row` with recalculation

- **Layout**
  - Horizontal scroll when needed
  - Min column width = **100px**

---

## 🛠️ Tech Stack

- **React** + **TypeScript**
- **React Context** for state
- **Vanilla CSS**

> ❌ No Redux / RTK / styled-components / UI libs  
> ✅ Spec requirements followed  

---

## 📦 Getting Started

```bash
# Install
npm install

# Dev
npm run dev

# Type check
npm run typecheck

# Build
npm run build

# Preview production
npm run preview

