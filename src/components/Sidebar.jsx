import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, BarChart3, X, Wallet } from 'lucide-react'

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/expenses', icon: Receipt, label: 'Expenses' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation()

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-[260px] bg-sidebar text-white
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Brand */}
                <div className="flex items-center justify-between px-6 py-8 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">ExpenseTracker</h1>
                            <p className="text-xs text-slate-400">Manage wisely</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-4 gap-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                className={`
                  flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25 '
                                        : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
                                    }
                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        )
                    })}
                </nav>

                {/* User section */}
                <div className="px-4 py-8 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-sm font-semibold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium">Alex Morgan</p>
                            <p className="text-xs text-slate-400">Personal Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
