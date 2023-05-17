const User = require('../models/User');
const { authSchema, placeSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')
const JWT = require('jsonwebtoken')

let blacklist = [];
const home = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.status(200).json({ message: 'welcome' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const register = async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findByEmail(result.email);
        if (user) {
            res.status(409).json({ message: 'User with the same email already exists' });
        } else {
            const newUser = new User(result.name, result.email, await User.bcryptPass(result.password));
            await newUser.save();
            const accessToken = await signAccessToken(newUser.id)
            console.log(accessToken)
            res.status(201).json({ message: 'User created successfully', token: accessToken });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
const login = async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findByEmail(result.email);
        if (user) {
            const isMatch = await User.isValidPass(result.password, user.password)
            if (!isMatch) {
                res.status(401).json({ message: 'Invalid password' });
            } else {
                const accessToken = await signAccessToken(user.id)
                const verified = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                const token = verified.aud;
                if (blacklist.includes(token)) {
                    blacklist = blacklist.filter((t) => t !== token);
                }
                res.status(200).json({ message: 'Logged in successfully', token: accessToken });
            }
        } else {
            res.status(409).json({ message: 'Use not registered' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
const logout = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        blacklist.push(user);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const addCoordinates = async (req, res, next) => {
    try {
        const result = await placeSchema.validateAsync(req.body);
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // res.status(200).json(user);
        const newFavorite = new Favorite(result.lat, result.lng, result.formatted_address);
        await newFavorite.save(user);
        res.status(201).json({ message: 'Place added successfully in Favorite List'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const allFavorites = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const favorites = await Favorite.getAllFavorites(user);
        res.status(201).json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// const refreshToken = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.body
//         if (!refreshToken) throw createError.BadRequest()
//         const userId = await verifyRefreshToken(refreshToken)

//         const accessToken = await signAccessToken(userId)
//         const refToken = await signRefreshToken(userId)
//         res.send({ accessToken: accessToken, refreshToken: refToken })
//     } catch (error) {
//         next(error)
//     }
// }

module.exports = {
    home,
    register,
    login,
    // refreshToken,
    logout,
    addCoordinates,
    allFavorites

}