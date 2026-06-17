const pdfParse = require("pdf-parse")
const { withTimeout } = require("../utils/timeout.util")

const PDF_PARSE_TIMEOUT_MS = 30000

/**
 * Extract plain text from a PDF buffer with timeout protection.
 */
async function extractTextFromPdf(buffer, label = "PDF") {
    console.log(`[PDF] Before parsing ${label}`)

    const parser = new pdfParse.PDFParse({ data: buffer })

    try {
        const result = await withTimeout(
            parser.getText(),
            `${label} pdf-parse`,
            PDF_PARSE_TIMEOUT_MS
        )

        console.log(`[PDF] ${label} parsed`, {
            textLength: result.text?.length ?? 0,
            pageCount: result.pages?.length ?? 0
        })

        return result.text ?? ""
    } finally {
        try {
            await parser.destroy()
        } catch (destroyError) {
            console.warn(`[PDF] Failed to destroy ${label} parser:`, destroyError.message)
        }
    }
}

module.exports = { extractTextFromPdf }
