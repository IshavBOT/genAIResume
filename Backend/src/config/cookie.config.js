const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true"

/**
 * Cross-origin production (Vercel → Render) requires SameSite=None + Secure.
 * Local dev uses lax so cookies work over http://localhost.
 */
function getAuthCookieOptions() {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
}

module.exports = { getAuthCookieOptions, isProduction }
