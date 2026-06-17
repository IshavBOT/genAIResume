import React from 'react'

const LoadingScreen = ({ message = 'Loading your interview plan...' }) => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">{message}</h1>
                <p className="mt-2 text-sm text-gray-600">Please wait a moment</p>
            </div>
        </main>
    )
}

export default LoadingScreen
