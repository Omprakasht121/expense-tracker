import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, IndianRupee, CreditCard, PiggyBank, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useExpenses } from '../context/ExpenseContext'
import { getCategoryById, CATEGORIES } from '../data/constants'
import AddExpenseModal from '../components/AddExpenseModal'
import SetBudgetModal from '../components/SetBudgetModal'
import { Edit2 } from 'lucide-react'

export default function Dashboard() {
    const {
        totalSpending,
        remainingBudget,
        budget,
        transactionCount,
        categoryBreakdown,
        getDailySpending,
        recentExpenses,
    } = useExpenses()

    const [modalOpen, setModalOpen] = useState(false)
    const [budgetModalOpen, setBudgetModalOpen] = useState(false)

    const dailyData = getDailySpending()
    const budgetUsedPercent = Math.round((totalSpending / budget) * 100)

    // Pie chart data
    const pieData = Object.entries(categoryBreakdown)
        .map(([key, value]) => ({
            name: getCategoryById(key).name,
            value: Math.round(value * 100) / 100,
            color: getCategoryById(key).color,
        }))
        .sort((a, b) => b.value - a.value)

    const statsCards = [
        {
            label: 'Total Balance',
            value: `₹${(budget).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            icon: IndianRupee,
            trend: '+0%',
            trendUp: true,
            color: 'text-primary-600',
            bg: 'bg-primary-50',
            iconBg: 'bg-primary-100',
        },
        {
            label: 'Monthly Spending',
            value: `₹${totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            icon: CreditCard,
            trend: `${budgetUsedPercent}% of budget`,
            trendUp: false,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            iconBg: 'bg-orange-100',
        },
        {
            label: 'Remaining Budget',
            value: `₹${remainingBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            icon: PiggyBank,
            trend: `${100 - budgetUsedPercent}% left`,
            trendUp: remainingBudget > 0,
            color: remainingBudget > 0 ? 'text-emerald-600' : 'text-red-600',
            bg: remainingBudget > 0 ? 'bg-emerald-50' : 'bg-red-50',
            iconBg: remainingBudget > 0 ? 'bg-emerald-100' : 'bg-red-100',
        },
        {
            label: 'Transactions',
            value: transactionCount,
            icon: ArrowUpRight,
            trend: 'this month',
            trendUp: true,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            iconBg: 'bg-violet-100',
        },
    ]

    const CustomTooltip = ({ active, payload, label }) => {
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

    return (
        <div className="animate-fade-in flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Welcome back, Alex! 👋
                    </h1>
                    <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your money today.</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-10 py-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all duration-200 "
                >
                    <Plus className="w-4 h-4" />
                    Add Expense
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 card-hover transition-smooth"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.bg} ${card.color}`}>
                                    {card.trendUp ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                                    {card.trend}
                                </span>
                                {i === 0 && (
                                    <button
                                        onClick={() => setBudgetModalOpen(true)}
                                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary-500 transition-colors tooltip"
                                        title="Edit Budget"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{card.label}</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1 font-numeric">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Spending Trends */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Spending Trends</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Daily spending over the last 30 days</p>
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={4}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v => `₹${v}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3b82f6"
                                    strokeWidth={2.5}
                                    fill="url(#colorAmount)"
                                    dot={false}
                                    activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spending Distribution */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Distribution</h2>
                    <div className="h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`₹${value.toFixed(2)}`, '']}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Total</p>
                                <p className="text-lg font-bold text-slate-800 font-numeric">₹{totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="space-y-3 mt-5">
                        {pieData.slice(0, 4).map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs text-slate-500">{item.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-700">{Math.round((item.value / totalSpending) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
                    <a href="/expenses" className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors">
                        View All
                    </a>
                </div>
                <div className="flex flex-col gap-4">
                    {recentExpenses.map((expense) => {
                        const cat = getCategoryById(expense.category)
                        return (
                            <div
                                key={expense.id}
                                className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                        style={{ backgroundColor: cat.bgColor }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{expense.description || cat.name}</p>
                                        <p className="text-xs text-slate-400">{cat.name} • {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-800 font-numeric">
                                    -₹{expense.amount.toFixed(2)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <AddExpenseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <SetBudgetModal isOpen={budgetModalOpen} onClose={() => setBudgetModalOpen(false)} />
        </div>
    )
}
