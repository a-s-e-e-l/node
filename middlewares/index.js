// const createError = require('http-errors')
const JWT = require('jsonwebtoken')
require('dotenv').config();
module.exports = {
    verifyAccessToken: async (req, res, next) => {
        if (!req.headers['authorization']) return res.status(401).send('Access Denied')
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        try {
            const verified = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = verified;
            next()

        } catch (error) {
            res.status(400).send('Invalid Tokn')
        }
    }
    // app.use(async (req, res, next) => {
    //     next(createError.NotFound())
    // })
    // app.use(async (err, req, res, next) => {
    // res.status(err.status || 500)
    // res.send({
    //     error: {
    //         status: err.status || 500,
    //         message: err.message,
    //     },
    // })
    // })

    
    // verifyAccessToken: async (req, res, next) => {
    //     if (!req.headers['authorization']) return next(createError.Unauthorized())
    //     const authHeader = req.headers['authorization']
    //     const bearerToken = authHeader.split(' ')
    //     const token = bearerToken[1]
    //     JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    //         if (err) {
    //             res.status(err.status || 500)
    //             res.send({
    //                 error: {
    //                     status: err.status || 500,
    //                     message: err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message,
    //                 },
    //             })
    //         }
    //         req.payload = payload
    //         next()
    //     })
    // }
    
}