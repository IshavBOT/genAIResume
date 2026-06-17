import React from 'react'

const scoreStyles = {
    high: {
        ring: 'border-emerald-500',
        sub: 'text-emerald-600',
        label: 'Strong match for this role'
    },
    mid: {
        ring: 'border-amber-500',
        sub: 'text-amber-600',
        label: 'Moderate match for this role'
    },
    low: {
        ring: 'border-red-500',
        sub: 'text-red-600',
        label: 'Needs improvement for this role'
    }
}

const MatchScoreCard = ({ score }) => {
    const level = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'
    const styles = scoreStyles[level]

    return (
        <div className="flex flex-col items-center gap-3">
            <p className="self-start text-xs font-semibold uppercase tracking-wider text-gray-600">
                Match Score
            </p>
            <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${styles.ring}`}>
                <span className="text-3xl font-extrabold leading-none text-gray-900">{score}</span>
                <span className="text-xs text-gray-600">%</span>
            </div>
            <p className={`text-center text-xs ${styles.sub}`}>{styles.label}</p>
        </div>
    )
}

export default MatchScoreCard
