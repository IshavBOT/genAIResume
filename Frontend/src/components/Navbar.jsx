import React from 'react'
import { useNavigate } from 'react-router'

const Navbar = ({ title = 'Interview Planner' }) => {
    const navigate = useNavigate()

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                >
                    {title}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                >
                    Home
                </button>
            </div>
        </header>
    )
}

export default Navbar
