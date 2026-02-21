import { Routes, Route } from 'react-router-dom'
import { ExpenseProvider } from './context/ExpenseContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Analytics from './pages/Analytics'

export default function App() {
    return (
        <ExpenseProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="analytics" element={<Analytics />} />
                </Route>
            </Routes>
        </ExpenseProvider>
    )
}
