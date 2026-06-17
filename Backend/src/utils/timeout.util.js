/**
 * Race a promise against a timeout so hung external calls always reject.
 */
function withTimeout(promise, label, ms = 30000) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`${label} timed out after ${ms}ms`))
            }, ms)
        })
    ])
}

module.exports = { withTimeout }
