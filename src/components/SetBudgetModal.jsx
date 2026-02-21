import { useState, useEffect } from 'react'
import { X, Check, IndianRupee } from 'lucide-react'
import { useExpenses } from '../context/ExpenseContext'

export default function SetBudgetModal({ isOpen, onClose }) {
    const { budget, dispatch } = useExpenses()
    const [value, setValue] = useState(budget.toString())

    useEffect(() => {
        if (isOpen) {
            setValue(budget.toString())
        }
    }, [isOpen, budget])

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        const numValue = parseFloat(value)
        if (!isNaN(numValue) && numValue >= 0) {
            dispatch({ type: 'SET_BUDGET', payload: numValue })
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-slide-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">Set Total Budget</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                            Monthly Budget Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">₹</span>
                            <input
                                autoFocus
                                type="number"
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full pl-12 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-3xl font-bold text-slate-800 focus:ring-2 focus:ring-primary-500/20 text-center font-numeric"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition-all"
                        >
                            <Check className="w-4 h-4" />
                            Update Budget
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
