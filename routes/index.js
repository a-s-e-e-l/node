const express = require('express');
const { favoriteController, authController } = require('../controllers');
const middlewares = require('../middlewares')
const router = express.Router();

// router.post('/create/people', PeopleController.addPeople);
router.get('/', middlewares.verifyAccessToken, authController.home)
    .post('/register', authController.register)
    .post('/login', authController.login)
    // .post('/refresh-token', async(req, res, next)=>{
    //     res.send('refresh token route')
    // })
    .post('/add/coordinate', middlewares.verifyAccessToken, favoriteController.addCoordinate)
    .post('/add/place', middlewares.verifyAccessToken, favoriteController.addPlace)
    .get('/all/coordinates', middlewares.verifyAccessToken, favoriteController.allCoordinates)
    .get('/all/places', middlewares.verifyAccessToken, favoriteController.allPlaces)
    .post('/logout', middlewares.verifyAccessToken, authController.logout)

module.exports = {
    routes: router
}