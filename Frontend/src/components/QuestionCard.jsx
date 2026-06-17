import React, { useState } from 'react'

const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div
                className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-slate-50"
                onClick={() => setOpen(o => !o)}
            >
                <span className="mt-0.5 shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
                    Q{index + 1}
                </span>
                <p className="flex-1 text-sm font-medium leading-relaxed text-gray-900">
                    {item.question}
                </p>
                <span className={`mt-0.5 shrink-0 text-gray-400 ${open ? 'rotate-180 text-indigo-600' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                        <span className="w-fit rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-violet-700">
                            Intention
                        </span>
                        <p className="text-sm leading-relaxed text-gray-600">{item.intention}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="w-fit rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                            Model Answer
                        </span>
                        <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuestionCard
