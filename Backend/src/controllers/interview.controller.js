const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const { extractTextFromPdf } = require("../services/pdf.service")
const interviewReportModel = require("../models/interviewReport.model")

const ROUTE_TAG = "[POST /api/interview]"

function log(step, data) {
    if (data !== undefined) {
        console.log(`${ROUTE_TAG} ${step}`, data)
    } else {
        console.log(`${ROUTE_TAG} ${step}`)
    }
}

function sendError(res, error, status = 500) {
    if (res.headersSent) {
        console.error(`${ROUTE_TAG} Response already sent — cannot send error:`, error.message)
        return
    }

    return res.status(status).json({
        success: false,
        error: error.message || "Failed to generate interview report."
    })
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    log("Route hit")

    try {
        log("After auth middleware — request reached controller")
        log("req.body", req.body)
        log("req.file", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            hasBuffer: Boolean(req.file.buffer)
        } : null)

        const { selfDescription, jobDescription } = req.body

        if (!jobDescription?.trim()) {
            return sendError(res, new Error("Job description is required."), 400)
        }

        let resumeText = ""

        if (req.file?.buffer) {
            resumeText = await extractTextFromPdf(req.file.buffer, "resume")
        } else {
            log("No resume file uploaded — skipping PDF parse")
        }

        if (!resumeText?.trim() && !selfDescription?.trim()) {
            return sendError(res, new Error("Resume or self description is required."), 400)
        }

        log("Before AI call")
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })
        log("AI response received", {
            title: interViewReportByAi?.title,
            matchScore: interViewReportByAi?.matchScore
        })

        log("Saving report to MongoDB")
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })
        log("Report saved", { interviewReportId: interviewReport._id })

        log("Response sent")
        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error(`${ROUTE_TAG} Error:`, error)
        return sendError(res, error)
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                error: "Interview report not found."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("[GET /api/interview/report/:interviewId] Error:", error)
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch interview report."
        })
    }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({
            user: req.user.id
        })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        return res.status(200).json({
            success: true,
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("[GET /api/interview/] Error:", error)
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch interview reports."
        })
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                error: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription
        })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        return res.send(pdfBuffer)
    } catch (error) {
        console.error("[POST /api/interview/resume/pdf/:interviewReportId] Error:", error)
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to generate resume PDF."
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}
