const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Catch unhandled errors from any route so requests never hang silently.
app.use((err, req, res, next) => {
    console.error("[Express error handler]", err)

    if (res.headersSent) {
        return next(err)
    }

    return res.status(500).json({
        success: false,
        error: err.message || "Internal server error."
    })
})

module.exports = app