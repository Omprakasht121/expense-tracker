import { createContext, useContext, useReducer, useEffect } from 'react'
import { SAMPLE_EXPENSES, DEFAULT_BUDGET } from '../data/constants'

const ExpenseContext = createContext()

const STORAGE_KEY = 'smart-expense-tracker'

const loadState = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (e) {
        console.error('Failed to load state:', e)
    }
    return {
        expenses: SAMPLE_EXPENSES,
        budget: DEFAULT_BUDGET,
    }
}

const saveState = (state) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
        console.error('Failed to save state:', e)
    }
}

const expenseReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_EXPENSE':
            return { ...state, expenses: [action.payload, ...state.expenses] }
        case 'EDIT_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.map(e =>
                    e.id === action.payload.id ? action.payload : e
                ),
            }
        case 'DELETE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.filter(e => e.id !== action.payload),
            }
        case 'SET_BUDGET':
            return { ...state, budget: action.payload }
        default:
            return state
    }
}

export function ExpenseProvider({ children }) {
    const [state, dispatch] = useReducer(expenseReducer, null, loadState)

    useEffect(() => {
        saveState(state)
    }, [state])

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyExpenses = state.expenses.filter(e => {
        const d = new Date(e.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const totalSpending = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)
    const remainingBudget = state.budget - totalSpending
    const transactionCount = monthlyExpenses.length

    const categoryBreakdown = monthlyExpenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount
        return acc
    }, {})

    const getDailySpending = () => {
        const days = {}
        for (let i = 29; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const key = d.toISOString().split('T')[0]
            days[key] = 0
        }
        monthlyExpenses.forEach(e => {
            if (days[e.date] !== undefined) {
                days[e.date] += e.amount
            }
        })
        return Object.entries(days).map(([date, amount]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: Math.round(amount * 100) / 100,
        }))
    }

    const recentExpenses = [...state.expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)

    const value = {
        expenses: state.expenses,
        budget: state.budget,
        monthlyExpenses,
        totalSpending,
        remainingBudget,
        transactionCount,
        categoryBreakdown,
        getDailySpending,
        recentExpenses,
        dispatch,
    }

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    )
}

export const useExpenses = () => {
    const context = useContext(ExpenseContext)
    if (!context) throw new Error('useExpenses must be used within ExpenseProvider')
    return context
}
