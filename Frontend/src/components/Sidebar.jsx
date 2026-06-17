import React from 'react'
import MatchScoreCard from './MatchScoreCard'
import SkillGapBadge from './SkillGapBadge'

const Sidebar = ({ report }) => {
    return (
        <aside className="w-full shrink-0 space-y-6 border-t border-gray-200 bg-slate-50 p-6 md:w-72 md:border-l md:border-t-0 lg:w-64 xl:w-72">
            <MatchScoreCard score={report.matchScore} />

            <div className="h-px bg-gray-200" />

            <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Skill Gaps
                </p>
                <div className="flex flex-wrap gap-2">
                    {report.skillGaps.map((gap, i) => (
                        <SkillGapBadge key={i} skill={gap.skill} severity={gap.severity} />
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
