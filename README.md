# SpendWise — Smart Expense Tracker & Financial Analytics

SpendWise is a modern, responsive, frontend-only financial expense management web application built with **React.js**, **Vite**, **Tailwind CSS**, and **Recharts**. It empowers users to track, analyze, filter, and plan their personal finances with real-time feedback, interactive charts, and rule-based insights—without needing any backend server or external database. All state persists reliably in **Browser LocalStorage**.

---

## 🌟 Key Features

### 1. Modern SaaS Dashboard (`/dashboard`)
- **Real-Time KPI Cards**: Total Expenses, This Month's Expenses, Today's Spend, Monthly Budget, Remaining Budget, and Budget Usage Percentage.
- **Dynamic Category Breakdown**: Interactive donut chart & category breakdown list.
- **Monthly Spending Trend**: Bar chart showcasing spending velocity across the past 6 months.
- **Recent Transactions**: Instant preview of latest entries with category badges and payment methods.
- **Rule-Based Smart Insights**: Proactive tips, warnings, and alerts derived from your data.

### 2. Comprehensive Expense Management (`/expenses`)
- **Full CRUD Support**: Add, view, edit, and delete expenses.
- **Safety Confirmations**: Confirmation modal before deleting any transaction.
- **Live Search**: Instant keyword search by description, category, or amount.
- **Categorical & Date Filters**: Filter by Food, Transportation, Shopping, Bills, Education, Entertainment, Healthcare, Other; or by All Time, This Month, Last 30 Days, This Year.
- **Multi-Sort**: Sort by newest/oldest date or highest/lowest amount.
- **Responsive Layout**: Desktop table and mobile-optimized cards.
- **Data Export**: One-click CSV export of filtered transactions.

### 3. Add Expense (`/add-expense` & Global Modal)
- Validated form fields: Amount (₹), Category, Description, Date (defaults to today), and Payment Method (UPI, Credit Card, Cash, etc.).
- Real-time input validation with helpful error indicators.
- Instant localStorage persistence and instant synchronization across all pages.
- Success toast notification.

### 4. Budget Management (`/budget`)
- Set and update monthly spending targets.
- Dynamic visual progress bar with color-coded states:
  - **Healthy (< 70%)**: Emerald theme.
  - **Near Limit (80% - 100%)**: Amber warning alert.
  - **Over-Budget (> 100%)**: Rose critical alert with exact deficit amount.
- Quick budget preset buttons (₹15k, ₹25k, ₹35k, ₹50k, ₹75k).
- Category-level consumption breakdown.

### 5. Advanced Analytics (`/analytics`)
- **Category Donut Chart** (Recharts `PieChart`) with custom currency tooltips.
- **Monthly Comparison Chart** (Recharts `BarChart`).
- **Spending Trend Over Time** (Recharts `AreaChart`) with gradient area curves.
- **Analytical KPIs**:
  - Highest spending category
  - Highest single expense
  - Average daily spend
  - Total number of transactions

### 6. Rule-Based Smart Insights
Dynamically calculated JavaScript rules:
- *"Food is your highest spending category this month (₹X, Y% of monthly spend)."*
- *"You have used X% of your monthly budget (₹A of ₹B)."*
- *"Your spending increased/decreased by X% compared with last month."*
- *"Your average daily spending is ₹X."*
- *"Shopping expenses are higher than last month."*
- *"You are currently within your monthly budget."* or *"Alert: Budget exceeded by ₹X!"*

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (Vanilla CSS utility engine)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Routing**: React Router DOM (v7)
- **Data Layer**: Browser LocalStorage API

---

## 📂 Project Structure

```
spendwise/
├── public/
│   └── favicon.svg              # SpendWise SVG logo
├── src/
│   ├── components/
│   │   ├── budget/
│   │   │   ├── BudgetModal.jsx      # Modal for adjusting monthly budget
│   │   │   └── BudgetProgress.jsx   # Visual progress bar & alerts
│   │   ├── charts/
│   │   │   ├── CategoryChart.jsx    # Recharts Donut chart
│   │   │   ├── MonthlyChart.jsx     # Recharts Bar chart
│   │   │   └── SpendingTrendChart.jsx # Recharts Area/Line chart
│   │   ├── common/
│   │   │   ├── ConfirmDialog.jsx    # Safe confirmation dialog
│   │   │   ├── EmptyState.jsx       # Polished empty state with action
│   │   │   ├── Modal.jsx            # Backdrop blur modal dialog
│   │   │   └── StatCard.jsx         # KPI card with themes & progress
│   │   ├── expenses/
│   │   │   ├── CategoryBadge.jsx    # Colored category pill
│   │   │   ├── CategoryFilter.jsx   # Filter pills
│   │   │   ├── ExpenseCard.jsx      # Mobile card view
│   │   │   ├── ExpenseForm.jsx      # Validated expense form
│   │   │   ├── ExpenseTable.jsx     # Desktop table
│   │   │   └── SearchBar.jsx        # Search input with clear button
│   │   ├── insights/
│   │   │   └── SmartInsights.jsx    # Dynamic insights display
│   │   └── layout/
│   │       ├── Layout.jsx           # App layout wrapper + quick add modal
│   │       ├── Navbar.jsx           # Top bar with budget badge & actions
│   │       └── Sidebar.jsx          # Desktop & mobile drawer navigation
│   ├── context/
│   │   ├── ExpenseContext.jsx       # Central reactive state & math
│   │   └── ToastContext.jsx         # Custom toast notification system
│   ├── pages/
│   │   ├── AddExpensePage.jsx       # Dedicated Add Expense page
│   │   ├── Analytics.jsx            # Deep analytics & trend charts
│   │   ├── BudgetPage.jsx           # Budget configuration & monitoring
│   │   ├── Dashboard.jsx            # Primary overview dashboard
│   │   └── Expenses.jsx             # Expense management with filters & sort
│   ├── utils/
│   │   ├── calculations.js          # Derived totals, charts, & rule insights
│   │   ├── constants.js             # Categories, colors, & storage keys
│   │   ├── formatters.js            # Currency (₹), date, and percentage helpers
│   │   └── storage.js               # LocalStorage CRUD & demo data generator
│   ├── App.jsx                      # Route definitions
│   ├── index.css                    # Tailwind CSS v4 entry & custom styles
│   └── main.jsx                     # React entrypoint
├── index.html                       # HTML head, fonts, & metadata
├── package.json
└── vite.config.js                   # Vite + Tailwind plugin config
```

---

## 🚀 How to Run the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 💾 LocalStorage Structure

- `spendwise_expenses_v1`: Array of expense objects:
  ```json
  [
    {
      "id": "exp-1729500000-abcde",
      "amount": 1500,
      "category": "Food",
      "description": "Team lunch celebration",
      "date": "2026-10-21",
      "paymentMethod": "UPI / GPay",
      "createdAt": "2026-10-21T06:30:00.000Z"
    }
  ]
  ```
- `spendwise_budget_v1`: Budget settings object:
  ```json
  {
    "month": 10,
    "year": 2026,
    "amount": 35000,
    "history": {
      "2026-10": 35000
    }
  }
  ```
