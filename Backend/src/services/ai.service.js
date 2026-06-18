const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer-core")
const chromium = require("@sparticuz/chromium")
const { withTimeout } = require("../utils/timeout.util")
const { resumeSchema } = require("../schemas/resume.schema")
const { generateResumeHTML } = require("./resumeTemplate.service")

const AI_TIMEOUT_MS = 30000

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        console.log("[AI] Generating interview report prompt")
        console.log("[AI] Input sizes:", {
            resumeLength: resume?.length ?? 0,
            selfDescriptionLength: selfDescription?.length ?? 0,
            jobDescriptionLength: jobDescription?.length ?? 0
        })

        const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

        console.log("[AI] Before Gemini API call")

        const response = await withTimeout(
            ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(interviewReportSchema),
                }
            }),
            "Gemini generateContent (interview report)",
            AI_TIMEOUT_MS
        )

        console.log("[AI] Gemini API response received")

        const parsed = JSON.parse(response.text)
        console.log("[AI] Interview report JSON parsed successfully")

        return parsed
    } catch (error) {
        console.error("[AI] generateInterviewReport failed:", error.message)
        throw error
    }
}

async function getBrowserLaunchOptions() {
    if (process.env.RENDER === "true") {
        return {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless
        }
    }

    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        return {
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
        }
    }

    const localChromePaths = {
        win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        linux: "/usr/bin/google-chrome"
    }

    return {
        headless: true,
        executablePath: localChromePaths[process.platform] || localChromePaths.linux
    }
}

async function generatePdfFromHtml(htmlContent) {
    console.log("[AI] Before launching Puppeteer for PDF generation")

    let browser

    try {
        const launchOptions = await getBrowserLaunchOptions()
        browser = await puppeteer.launch(launchOptions)
    } catch (err) {
        console.error("[PDF] Browser launch failed:", err)
        throw err
    }

    try {
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })

        const pdfBuffer = await page.pdf({
            format: "A4", margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        })

        console.log("[AI] Resume PDF generated via Puppeteer")
        return pdfBuffer
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}

function buildResumeExtractionPrompt({ resume, selfDescription, jobDescription }) {
    return `You are a resume data extractor and formatter. Your job is to organize existing candidate information into structured JSON.

SOURCE MATERIAL:
Resume:
${resume || "(empty)"}

Self Description:
${selfDescription || "(empty)"}

Target Job Description (for relevance ordering only — do NOT invent facts from this):
${jobDescription || "(empty)"}

IMPORTANT RULES:
1. Never invent information.
2. Never fabricate names.
3. Never fabricate companies.
4. Never fabricate phone numbers.
5. Never fabricate email addresses.
6. Never fabricate locations.
7. Never fabricate work experience.
8. Never fabricate education.
9. Never fabricate dates.
10. Use ONLY information present in:
   - Resume
   - Self Description
11. If information is unavailable:
   - Leave it empty
   - Omit the section by returning an empty string or empty array
12. Do not create placeholder values like:
   - John Doe
   - Alex Rivera
   - San Francisco
   - University of Texas
13. Return JSON only.
14. Do NOT generate HTML.
15. Do NOT guess missing contact details.
16. Do NOT create fake jobs, projects, schools, or achievements.
17. Projects must come only from the resume or self description.
18. Experience must come only from the resume or self description. If no experience exists, return an empty experience array.
19. Education must come only from the resume or self description. If no education exists, return an empty education array.
20. You may rewrite wording for clarity, but every fact must be traceable to the source material.
21. You may order skills and bullets to emphasize relevance to the target job, but only using skills and facts already present in the source material.

Return structured JSON matching this shape:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "summary": "",
  "skills": [],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "duration": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "achievements": []
    }
  ]
}`
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        console.log("[AI] Generating structured resume JSON")

        const prompt = buildResumeExtractionPrompt({ resume, selfDescription, jobDescription })

        console.log("[AI] Before Gemini API call (resume JSON extraction)")

        const response = await withTimeout(
            ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(resumeSchema),
                }
            }),
            "Gemini generateContent (resume JSON)",
            AI_TIMEOUT_MS
        )

        console.log("[AI] Gemini API response received (resume JSON)")

        const resumeData = resumeSchema.parse(JSON.parse(response.text))
        console.log("[AI] Resume JSON validated successfully")

        const htmlContent = generateResumeHTML(resumeData)
        console.log("[AI] Resume HTML generated from template")

        const pdfBuffer = await generatePdfFromHtml(htmlContent)

        return pdfBuffer
    } catch (error) {
        console.error("[AI] generateResumePdf failed:", error.message)
        throw error
    }
}

module.exports = { generateInterviewReport, generateResumePdf }
