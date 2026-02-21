import { useState, useMemo } from 'react'
import { Plus, Search, Filter, Edit3, Trash2, ChevronDown } from 'lucide-react'
import { useExpenses } from '../context/ExpenseContext'
import { getCategoryById, CATEGORIES } from '../data/constants'
import AddExpenseModal from '../components/AddExpenseModal'

export default function Expenses() {
    const { expenses, dispatch } = useExpenses()
    const [modalOpen, setModalOpen] = useState(false)
    const [editExpense, setEditExpense] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [sortBy, setSortBy] = useState('date-desc')
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filteredExpenses = useMemo(() => {
        let result = [...expenses]

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(e =>
                e.description?.toLowerCase().includes(q) ||
                getCategoryById(e.category).name.toLowerCase().includes(q)
            )
        }

        // Category filter
        if (categoryFilter !== 'all') {
            result = result.filter(e => e.category === categoryFilter)
        }

        // Sort
        switch (sortBy) {
            case 'date-desc':
                result.sort((a, b) => new Date(b.date) - new Date(a.date))
                break
            case 'date-asc':
                result.sort((a, b) => new Date(a.date) - new Date(b.date))
                break
            case 'amount-desc':
                result.sort((a, b) => b.amount - a.amount)
                break
            case 'amount-asc':
                result.sort((a, b) => a.amount - b.amount)
                break
        }

        return result
    }, [expenses, searchQuery, categoryFilter, sortBy])

    const handleEdit = (expense) => {
        setEditExpense(expense)
        setModalOpen(true)
    }

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_EXPENSE', payload: id })
        setDeleteConfirm(null)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setEditExpense(null)
    }

    const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

    return (
        <div className="animate-fade-in flex flex-col gap-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Expenses</h1>
                    <p className="text-slate-500 mt-1">Manage and track all your transactions</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-10 py-4 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all duration-200 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add Expense
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Category filter */}
                    <div className="relative">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(c => (
                                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-4 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Highest Amount</option>
                            <option value="amount-asc">Lowest Amount</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        Showing <span className="font-semibold text-slate-600">{filteredExpenses.length}</span> expenses
                    </p>
                    <p className="text-xs text-slate-400">
                        Total: <span className="font-semibold text-slate-600">₹{totalFiltered.toFixed(2)}</span>
                    </p>
                </div>
            </div>

            {/* Expense List */}
            <div className="flex flex-col gap-6">
                {filteredExpenses.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
                        <div className="text-5xl mb-4">💸</div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No expenses found</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            {searchQuery || categoryFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Start tracking your spending by adding your first expense'}
                        </p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Add Expense
                        </button>
                    </div>
                ) : (
                    filteredExpenses.map((expense) => {
                        const cat = getCategoryById(expense.category)
                        return (
                            <div
                                key={expense.id}
                                className="bg-white rounded-2xl p-10 md:p-12 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                                            style={{ backgroundColor: cat.bgColor }}
                                        >
                                            {cat.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 truncate">
                                                {expense.description || cat.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                                                    style={{ backgroundColor: cat.bgColor, color: cat.color }}
                                                >
                                                    {cat.name}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(expense.date).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-base font-bold text-slate-800 font-numeric">
                                            -₹{expense.amount.toFixed(2)}
                                        </span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(expense)}
                                                className="p-2 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-500 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            {deleteConfirm === expense.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold hover:bg-slate-200 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(expense.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            <AddExpenseModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                editExpense={editExpense}
            />
        </div>
    )
}
