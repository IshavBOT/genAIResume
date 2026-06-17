import React from 'react'

const RoadmapCard = ({ day }) => {
    return (
        <div className="relative border-b border-gray-100 py-4 pl-10 last:border-b-0">
            <span className="absolute left-0 top-5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-white" />
            <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600">
                    Day {day.day}
                </span>
                <h3 className="text-base font-semibold text-gray-900">{day.focus}</h3>
            </div>
            <ul className="flex flex-col gap-1.5">
                {day.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-gray-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RoadmapCard
