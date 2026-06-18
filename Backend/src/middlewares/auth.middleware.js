const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



async function authUser(req, res, next) {

    console.log("Cookies received:", req.cookies)
    console.log("Cookies:", req.cookies)
    console.log("Token:", req.cookies.token)
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET)

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    console.log("Blacklisted:", !!isTokenBlacklisted)

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {

        console.error("[Auth] JWT verification failed:", err)

        return res.status(401).json({
            message: err.message || "Invalid token."
        })
    }

}


module.exports = { authUser }
