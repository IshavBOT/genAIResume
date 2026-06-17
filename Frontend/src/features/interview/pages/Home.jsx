import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_EXTENSIONS = [ '.pdf', '.docx' ]

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileTypeLabel = (file) => {
    if (file.name.toLowerCase().endsWith('.pdf')) return 'PDF'
    if (file.name.toLowerCase().endsWith('.docx')) return 'DOCX'
    return 'Unknown'
}

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ fileError, setFileError ] = useState("")
    const [ isDragging, setIsDragging ] = useState(false)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const validateFile = (file) => {
        const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
        const isAllowedType = ALLOWED_EXTENSIONS.includes(extension)

        if (!isAllowedType) {
            return 'Please upload a PDF or DOCX file.'
        }

        if (file.size > MAX_FILE_SIZE) {
            return 'File size exceeds 5MB.'
        }

        return null
    }

    const handleFileSelection = (file) => {
        if (!file) return

        const error = validateFile(file)

        if (error) {
            setFileError(error)
            setSelectedFile(null)

            if (resumeInputRef.current) {
                resumeInputRef.current.value = ''
            }

            return
        }

        setFileError('')
        setSelectedFile(file)
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        handleFileSelection(file)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileSelection(e.dataTransfer.files?.[0])
    }

    const handleGenerateReport = async () => {
        const resumeFile = selectedFile || resumeInputRef.current?.files?.[0];

        if (!resumeFile && !selfDescription.trim()) {
            alert("Please upload a resume or enter a self description.");
            return;
        }

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        });

        navigate(`/interview/${data._id}`);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600'
        if (score >= 60) return 'text-amber-600'
        return 'text-red-600'
    }

    const isGenerateDisabled = loading || (!selectedFile && !selfDescription.trim())

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center space-y-8 bg-slate-50 px-6 py-12">

            {/* Page Header — was .page-header */}
            <header className="max-w-2xl text-center">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                    Create Your Custom <span className="text-indigo-600">Interview Plan</span>
                </h1>
                <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                </p>
            </header>

            {/* Main Card — was .interview-card */}
            <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-sm">

                {/* Card Body — was .interview-card__body */}
                <div className="flex min-h-[520px] flex-col md:flex-row">

                    {/* Left Panel — was .panel .panel--left */}
                    <div className="relative flex flex-1 flex-col gap-4 p-6">
                        <div className="mb-1 flex items-center gap-2">
                            <span className="flex items-center text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2 className="flex-1 text-base font-semibold text-gray-900">Target Job Description</h2>
                            <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                Required
                            </span>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className="min-h-[360px] flex-1 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                            value={jobDescription}
                        />
                        <div className="text-right text-xs text-gray-600">
                            {jobDescription.length} / 5000 chars
                        </div>
                    </div>

                    {/* Divider — was .panel-divider */}
                    <div className="hidden w-px shrink-0 bg-gray-200 md:block" />
                    <div className="h-px w-full bg-gray-200 md:hidden" />

                    {/* Right Panel — was .panel .panel--right */}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                        <div className="mb-1 flex items-center gap-2">
                            <span className="flex items-center text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2 className="text-base font-semibold text-gray-900">Your Profile</h2>
                        </div>

                        {/* Upload — was .upload-section / .dropzone */}
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                Upload Resume
                                <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                    Best Results
                                </span>
                            </label>

                            <input
                                ref={resumeInputRef}
                                hidden
                                type='file'
                                id='resume'
                                name='resume'
                                accept='.pdf,.docx'
                                onChange={handleFileChange}
                            />

                            {selectedFile && !fileError ? (
                                <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-6 transition-all duration-200">
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                        </span>
                                        <div className="flex-1 space-y-2">
                                            <p className="text-sm font-semibold text-gray-900">Resume Uploaded</p>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p><span className="font-medium text-gray-900">Filename:</span> {selectedFile.name}</p>
                                                <p><span className="font-medium text-gray-900">Size:</span> {formatFileSize(selectedFile.size)}</p>
                                                <p><span className="font-medium text-gray-900">Supported type:</span> {getFileTypeLabel(selectedFile)}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => resumeInputRef.current?.click()}
                                                className="mt-2 rounded-xl border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                                            >
                                                Change Resume
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <label
                                    htmlFor='resume'
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-6 transition-all duration-200 ${
                                        isDragging
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : fileError
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-200 bg-slate-50 hover:border-indigo-600 hover:bg-indigo-50/50'
                                    }`}
                                >
                                    <span className="mb-1 text-indigo-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className="text-sm font-medium text-gray-900">Click to upload or drag &amp; drop</p>
                                    <p className="text-xs text-gray-600">PDF or DOCX (Max 5MB)</p>
                                </label>
                            )}

                            {fileError && (
                                <p className="text-sm text-red-500">{fileError}</p>
                            )}
                        </div>

                        {/* OR Divider — was .or-divider */}
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span>OR</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        {/* Self Description — was .self-description */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-900" htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className="h-24 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                value={selfDescription}
                            />
                        </div>

                        {/* Info Box — was .info-box */}
                        <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                            <span className="mt-0.5 shrink-0 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2" /></svg>
                            </span>
                            <p className="text-sm leading-relaxed text-blue-800">
                                Either a <strong className="text-gray-900">Resume</strong> or a <strong className="text-gray-900">Self Description</strong> is required to generate a personalized plan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Footer — was .interview-card__footer */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row">
                    <span className="text-sm text-gray-600">AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        type="button"
                        onClick={handleGenerateReport}
                        disabled={isGenerateDisabled}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        {loading ? 'Generating...' : 'Generate My Interview Strategy'}
                    </button>
                </div>
            </div>

            {/* Recent Reports — was .recent-reports */}
            {reports.length > 0 && (
                <section className="flex w-full flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">My Recent Interview Plans</h2>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reports.map(report => (
                            <li
                                key={report._id}
                                className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-indigo-200 hover:shadow-md"
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <h3 className="font-semibold text-gray-900">{report.title || 'Untitled Position'}</h3>
                                <p className="text-sm text-gray-600">
                                    Generated on {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                                <p className={`text-sm font-semibold ${getScoreColor(report.matchScore)}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Footer — was .page-footer */}
            <footer className="flex flex-wrap justify-center gap-6">
                <a href='#' className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
                <a href='#' className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
                <a href='#' className="text-sm text-gray-600 hover:text-gray-900">Help Center</a>
            </footer>
        </div>
    )
}

export default Home
