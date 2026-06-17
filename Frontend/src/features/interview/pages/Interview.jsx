import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'
import LoadingScreen from '../../../components/LoadingScreen.jsx'
import Navigation from '../../../components/Navigation.jsx'
import Sidebar from '../../../components/Sidebar.jsx'
import QuestionCard from '../../../components/QuestionCard.jsx'
import RoadmapCard from '../../../components/RoadmapCard.jsx'
import Navbar from '../../../components/Navbar.jsx'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    if (loading || !report) {
        return <LoadingScreen />
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar title={report.title || 'Interview Plan'} />

            {/* Page shell — was .interview-page */}
            <div className="mx-auto max-w-7xl px-6 py-6">
                {/* Layout — was .interview-layout */}
                <div className="mx-auto flex max-w-7xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:flex-row">

                    {/* Left Nav — was .interview-nav */}
                    <Navigation
                        items={NAV_ITEMS}
                        activeId={activeNav}
                        onSelect={setActiveNav}
                        onDownloadResume={() => { getResumePdf(interviewId) }}
                    />

                    {/* Center Content — was .interview-content */}
                    <div className="flex flex-1 flex-col md:flex-row">
                        <main className="min-h-[60vh] flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
                        {activeNav === 'technical' && (
                            <section>
                                <div className="mb-6 flex flex-wrap items-baseline gap-3 border-b border-gray-200 pb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Technical Questions</h2>
                                    <span className="rounded-full border border-gray-200 bg-slate-50 px-3 py-0.5 text-sm text-gray-600">
                                        {report.technicalQuestions.length} questions
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'behavioral' && (
                            <section>
                                <div className="mb-6 flex flex-wrap items-baseline gap-3 border-b border-gray-200 pb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Behavioral Questions</h2>
                                    <span className="rounded-full border border-gray-200 bg-slate-50 px-3 py-0.5 text-sm text-gray-600">
                                        {report.behavioralQuestions.length} questions
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'roadmap' && (
                            <section>
                                <div className="mb-6 flex flex-wrap items-baseline gap-3 border-b border-gray-200 pb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Preparation Road Map</h2>
                                    <span className="rounded-full border border-gray-200 bg-slate-50 px-3 py-0.5 text-sm text-gray-600">
                                        {report.preparationPlan.length}-day plan
                                    </span>
                                </div>
                                <div className="relative border-l-2 border-indigo-200 pl-4">
                                    {report.preparationPlan.map((day) => (
                                        <RoadmapCard key={day.day} day={day} />
                                    ))}
                                </div>
                            </section>
                        )}
                        </main>

                        <Sidebar report={report} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Interview
