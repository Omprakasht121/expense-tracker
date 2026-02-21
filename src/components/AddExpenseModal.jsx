import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { CATEGORIES } from '../data/constants'
import { useExpenses } from '../context/ExpenseContext'

export default function AddExpenseModal({ isOpen, onClose, editExpense = null }) {
    const { dispatch } = useExpenses()
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => {
        if (editExpense) {
            setAmount(editExpense.amount.toString())
            setCategory(editExpense.category)
            setDescription(editExpense.description)
            setDate(editExpense.date)
        } else {
            setAmount('')
            setCategory('')
            setDescription('')
            setDate(new Date().toISOString().split('T')[0])
        }
    }, [editExpense, isOpen])

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!amount || !category) return

        const expense = {
            id: editExpense?.id || uuidv4(),
            amount: parseFloat(amount),
            category,
            description,
            date,
        }

        dispatch({
            type: editExpense ? 'EDIT_EXPENSE' : 'ADD_EXPENSE',
            payload: expense,
        })

        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 modal-backdrop"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {editExpense ? 'Edit Expense' : 'Add New Expense'}
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* CONTENT */}
                <form
                    onSubmit={handleSubmit}
                    className="px-10 py-10 flex flex-col gap-10"
                >
                    {/* AMOUNT */}
                    <div className="text-center flex flex-col gap-4">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Amount
                        </label>

                        <div className="flex items-end justify-center gap-2">
                            <span className="text-2xl text-slate-400">₹</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="text-4xl font-bold text-center text-slate-800 w-52 outline-none border-b-2 border-slate-200 focus:border-primary-500 pb-2 bg-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* CATEGORY + DATE */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-semibold text-slate-400 uppercase">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Category</option>
                                {CATEGORIES.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.icon} {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-semibold text-slate-400 uppercase">
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* QUICK CHIPS */}
                    <div className="flex flex-wrap gap-4">
                        {CATEGORIES.slice(0, 5).map(c => (
                            <button
                                type="button"
                                key={c.id}
                                onClick={() => setCategory(c.id)}
                                className={`
                                    flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition
                                    ${category === c.id
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300'}
                                `}
                            >
                                {c.icon} {c.name}
                            </button>
                        ))}
                    </div>

                    {/* NOTE */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-slate-400 uppercase">
                            Note <span className="normal-case text-slate-300">(Optional)</span>
                        </label>

                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="What was this expense for?"
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* BUTTON AREA */}
                    <div className="flex gap-6 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 py-4 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition"
                        >
                            <Check className="w-4 h-4" />
                            {editExpense ? 'Update Expense' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}