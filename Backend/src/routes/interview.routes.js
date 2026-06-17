const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

const ROUTE_TAG = "[POST /api/interview]"

/**
 * Multer wrapper with logging and guaranteed error response on upload failure.
 */
function handleResumeUpload(req, res, next) {
    console.log(`${ROUTE_TAG} Before multer upload processing`)

    upload.single("resume")(req, res, (err) => {
        if (err) {
            console.error(`${ROUTE_TAG} Multer error:`, err.message)
            return res.status(400).json({
                success: false,
                error: err.message || "File upload failed."
            })
        }

        console.log(`${ROUTE_TAG} Multer upload complete`)
        console.log(`${ROUTE_TAG} req.files:`, req.files)
        console.log(`${ROUTE_TAG} req.body:`, req.body)
        next()
    })
}

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post(
    "/",
    (req, res, next) => {
        console.log(`${ROUTE_TAG} Entering route`)
        next()
    },
    authMiddleware.authUser,
    (req, res, next) => {
        console.log(`${ROUTE_TAG} Auth passed for user:`, req.user?.id)
        next()
    },
    handleResumeUpload,
    interviewController.generateInterViewReportController
)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)



module.exports = interviewRouter
