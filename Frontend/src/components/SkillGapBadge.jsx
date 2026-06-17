import React from 'react'

const severityStyles = {
    high: 'border-red-200 bg-red-50 text-red-700',
    medium: 'border-amber-200 bg-amber-50 text-amber-700',
    low: 'border-emerald-200 bg-emerald-50 text-emerald-700'
}

const SkillGapBadge = ({ skill, severity }) => {
    return (
        <span className={`rounded-xl border px-3 py-1 text-sm font-medium ${severityStyles[severity] || severityStyles.low}`}>
            {skill}
        </span>
    )
}

export default SkillGapBadge
