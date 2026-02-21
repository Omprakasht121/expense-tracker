import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100 ">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="text-sm font-semibold text-slate-800">ExpenseTracker</span>
                    <div className="w-9" />
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto px-6 py-6 md:px-12 md:py-8 lg:px-20 lg:py-10">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
