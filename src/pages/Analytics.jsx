import { useMemo } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, Zap, Lightbulb } from 'lucide-react'
import { useExpenses } from '../context/ExpenseContext'
import { getCategoryById, CATEGORIES } from '../data/constants'

export default function Analytics() {
    const { expenses, totalSpending, budget, categoryBreakdown, monthlyExpenses } = useExpenses()

    // Category bar chart data with budget percentages
    const categoryData = useMemo(() => {
        return Object.entries(categoryBreakdown)
            .map(([key, value]) => {
                const cat = getCategoryById(key)
                return {
                    name: cat.name,
                    icon: cat.icon,
                    amount: Math.round(value * 100) / 100,
                    color: cat.color,
                    bgColor: cat.bgColor,
                    percent: Math.round((value / totalSpending) * 100),
                }
            })
            .sort((a, b) => b.amount - a.amount)
    }, [categoryBreakdown, totalSpending])

    // Monthly comparison (generate last 6 months)
    const monthlyComparison = useMemo(() => {
        const months = []
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const month = d.getMonth()
            const year = d.getFullYear()
            const monthExpenses = expenses.filter(e => {
                const ed = new Date(e.date)
                return ed.getMonth() === month && ed.getFullYear() === year
            })
            const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
            months.push({
                month: d.toLocaleDateString('en-US', { month: 'short' }),
                amount: Math.round(total * 100) / 100,
            })
        }
        return months
    }, [expenses])

    // Weekly trends for current month
    const weeklyTrend = useMemo(() => {
        const weeks = [
            { name: 'Week 1', amount: 0 },
            { name: 'Week 2', amount: 0 },
            { name: 'Week 3', amount: 0 },
            { name: 'Week 4', amount: 0 },
        ]
        monthlyExpenses.forEach(e => {
            const day = new Date(e.date).getDate()
            const weekIndex = Math.min(Math.floor((day - 1) / 7), 3)
            weeks[weekIndex].amount += e.amount
        })
        weeks.forEach(w => w.amount = Math.round(w.amount * 100) / 100)
        return weeks
    }, [monthlyExpenses])

    // Insights
    const insights = useMemo(() => {
        const items = []
        const budgetUsed = (totalSpending / budget) * 100

        if (budgetUsed >= 80) {
            items.push({
                type: 'warning',
                icon: AlertTriangle,
                title: 'Budget Alert',
                message: `You've used ${Math.round(budgetUsed)}% of your monthly budget. Consider reducing non-essential spending.`,
                color: 'bg-amber-50 border-amber-200',
                iconColor: 'text-amber-500',
            })
        }

        const topCategory = categoryData[0]
        if (topCategory) {
            items.push({
                type: 'info',
                icon: TrendingUp,
                title: 'Top Spending Category',
                message: `${topCategory.icon} ${topCategory.name} accounts for ${topCategory.percent}% of your spending at ₹${topCategory.amount.toFixed(2)}.`,
                color: 'bg-blue-50 border-blue-200',
                iconColor: 'text-blue-500',
            })
        }

        const remaining = budget - totalSpending
        if (remaining > 0) {
            const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
            const today = new Date().getDate()
            const daysLeft = daysInMonth - today
            const dailyBudget = daysLeft > 0 ? (remaining / daysLeft).toFixed(2) : 0
            items.push({
                type: 'tip',
                icon: Lightbulb,
                title: 'Daily Budget Tip',
                message: `You can spend ₹${dailyBudget}/day for the next ${daysLeft} days to stay on budget.`,
                color: 'bg-emerald-50 border-emerald-200',
                iconColor: 'text-emerald-500',
            })
        }

        items.push({
            type: 'savings',
            icon: Zap,
            title: 'Savings Potential',
            message: `You're projected to save ₹${Math.max(0, remaining).toFixed(2)} this month. ${remaining > 0 ? 'Great job! Keep it up.' : 'Consider adjusting your spending.'}`,
            color: remaining > 0 ? 'bg-violet-50 border-violet-200' : 'bg-red-50 border-red-200',
            iconColor: remaining > 0 ? 'text-violet-500' : 'text-red-500',
        })

        return items
    }, [totalSpending, budget, categoryData])

    const CustomBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-800">₹{payload[0].value.toFixed(2)}</p>
                </div>
            )
        }
        return null
    }

    const COLORS = categoryData.map(d => d.color)

    return (
        <div className="animate-fade-in flex flex-col gap-16 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Analytics</h1>
                <p className="text-slate-500 mt-1">Understand your spending patterns and make smarter decisions</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Budget</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1 font-numeric">₹{budget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.min(100, (totalSpending / budget) * 100)}%`,
                                backgroundColor: totalSpending > budget ? '#ef4444' : '#3b82f6',
                            }}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Spent</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1 font-numeric">₹{totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-orange-500 font-medium mt-2">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        {Math.round((totalSpending / budget) * 100)}% of budget
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Remaining</p>
                    <p className={`text-2xl font-bold mt-1 font-numeric ${budget - totalSpending >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ₹{(budget - totalSpending).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-medium mt-2 ${budget - totalSpending >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {budget - totalSpending >= 0 ? (
                            <><TrendingDown className="w-3 h-3 inline mr-1" />{Math.round(((budget - totalSpending) / budget) * 100)}% left</>
                        ) : (
                            <><TrendingUp className="w-3 h-3 inline mr-1" />Over budget!</>
                        )}
                    </p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-5">Category Breakdown</h2>
                    <div className="space-y-4">
                        {categoryData.map((cat, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">{cat.icon}</span>
                                        <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-700 font-numeric">₹{cat.amount.toFixed(2)}</span>
                                        <span className="text-xs text-slate-400">{cat.percent}%</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${cat.percent}%`,
                                            backgroundColor: cat.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Comparison */}
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-5">Monthly Comparison</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyComparison}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v => `₹${v}`}
                                />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Trends */}
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-5">Weekly Spending Trend</h2>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v => `₹${v}`}
                                />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Smart Insights */}
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-5">Smart Insights</h2>
                    <div className="space-y-3">
                        {insights.map((insight, i) => (
                            <div
                                key={i}
                                className={`p-4 rounded-xl border ${insight.color} animate-slide-left`}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="flex items-start gap-3">
                                    <insight.icon className={`w-5 h-5 mt-0.5 shrink-0 ${insight.iconColor}`} />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{insight.title}</p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Distribution Donut */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-5">Spending Distribution</h2>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="h-[250px] w-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="amount"
                                    stroke="none"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`₹${value.toFixed(2)}`, '']}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Total</p>
                                <p className="text-xl font-bold text-slate-800 font-numeric">₹{totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                        {categoryData.map((cat, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl"
                                style={{ backgroundColor: cat.bgColor }}
                            >
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 truncate">{cat.name}</p>
                                    <p className="text-xs text-slate-500">{cat.percent}% · ₹{cat.amount.toFixed(0)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
