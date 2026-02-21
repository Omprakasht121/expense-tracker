import { v4 as uuidv4 } from 'uuid'

export const CATEGORIES = [
    { id: 'food', name: 'Food', icon: '🍔', color: '#f97316', bgColor: '#fff7ed' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#3b82f6', bgColor: '#eff6ff' },
    { id: 'housing', name: 'Housing', icon: '🏠', color: '#6366f1', bgColor: '#eef2ff' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#a855f7', bgColor: '#faf5ff' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899', bgColor: '#fdf2f8' },
    { id: 'bills', name: 'Bills', icon: '📄', color: '#14b8a6', bgColor: '#f0fdfa' },
    { id: 'health', name: 'Health', icon: '❤️', color: '#ef4444', bgColor: '#fef2f2' },
    { id: 'education', name: 'Education', icon: '📚', color: '#0ea5e9', bgColor: '#f0f9ff' },
    { id: 'other', name: 'Other', icon: '📦', color: '#64748b', bgColor: '#f8fafc' },
]

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]

const today = new Date()
const daysAgo = (n) => {
    const d = new Date(today)
    d.setDate(d.getDate() - n)
    return d.toISOString().split('T')[0]
}

export const SAMPLE_EXPENSES = [
    { id: uuidv4(), amount: 45.50, category: 'food', description: 'Grocery shopping at Walmart', date: daysAgo(0) },
    { id: uuidv4(), amount: 12.00, category: 'transport', description: 'Uber ride to office', date: daysAgo(0) },
    { id: uuidv4(), amount: 1200.00, category: 'housing', description: 'Monthly rent payment', date: daysAgo(1) },
    { id: uuidv4(), amount: 15.99, category: 'entertainment', description: 'Netflix subscription', date: daysAgo(2) },
    { id: uuidv4(), amount: 89.00, category: 'shopping', description: 'New running shoes', date: daysAgo(3) },
    { id: uuidv4(), amount: 65.00, category: 'bills', description: 'Electricity bill', date: daysAgo(4) },
    { id: uuidv4(), amount: 35.00, category: 'health', description: 'Pharmacy prescription', date: daysAgo(5) },
    { id: uuidv4(), amount: 150.00, category: 'education', description: 'Online course subscription', date: daysAgo(6) },
    { id: uuidv4(), amount: 28.50, category: 'food', description: 'Dinner at restaurant', date: daysAgo(7) },
    { id: uuidv4(), amount: 8.50, category: 'transport', description: 'Bus pass top-up', date: daysAgo(8) },
    { id: uuidv4(), amount: 42.00, category: 'shopping', description: 'Amazon order - books', date: daysAgo(9) },
    { id: uuidv4(), amount: 55.00, category: 'bills', description: 'Internet bill', date: daysAgo(10) },
    { id: uuidv4(), amount: 22.00, category: 'food', description: 'Coffee & snacks', date: daysAgo(12) },
    { id: uuidv4(), amount: 120.00, category: 'entertainment', description: 'Concert tickets', date: daysAgo(14) },
    { id: uuidv4(), amount: 18.00, category: 'transport', description: 'Gas station fill-up', date: daysAgo(16) },
    { id: uuidv4(), amount: 200.00, category: 'health', description: 'Dental checkup', date: daysAgo(18) },
    { id: uuidv4(), amount: 75.00, category: 'shopping', description: 'Winter jacket', date: daysAgo(20) },
    { id: uuidv4(), amount: 32.00, category: 'food', description: 'Takeout sushi', date: daysAgo(22) },
    { id: uuidv4(), amount: 95.00, category: 'bills', description: 'Phone bill', date: daysAgo(25) },
    { id: uuidv4(), amount: 48.00, category: 'entertainment', description: 'Video game purchase', date: daysAgo(28) },
]

export const DEFAULT_BUDGET = 3500
