import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../../../components/LoadingScreen.jsx'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const {loading,handleRegister} = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({username,email,password})
        navigate("/")
    }

    if(loading){
        return <LoadingScreen message="Loading..." />
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">Register</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="text-sm font-medium text-gray-900">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username'
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-900">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address'
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-900">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password'
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-900 outline-none focus:border-indigo-600"
                        />
                    </div>

                    <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        Register
                    </button>

                </form>

                <p className="mt-4 text-sm text-gray-600">
                    Already have an account? <Link to={"/login"} className="font-medium text-indigo-600 hover:text-indigo-700">Login</Link>
                </p>
            </div>
        </main>
    )
}

export default Register
