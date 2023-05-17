const {coordinateModel, placeModel} = require('../models')
const { placeSchema, coordinateSchema } = require('../helpers/validation_schema')

let blacklist = [];

const addCoordinate = async (req, res, next) => {
    try {
        const result = await coordinateSchema.validateAsync(req.body);
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const newFavorite = new coordinateModel(result.lat, result.lng, result.place_id);
        await newFavorite.save(user);
        res.status(201).json({ message: 'Added successfully in Favorite Coordinate List'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
const addPlace = async (req, res, next) => {
    try {
        const result = await placeSchema.validateAsync(req.body);
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const newFavorite = new placeModel(result.lat, result.lng );
        await newFavorite.save(user);
        res.status(201).json({ message: 'Added successfully in Favorite Place List'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const allCoordinates = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const favorites = await coordinateModel.getAllCoordinates(user);
        res.status(201).json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const allPlaces = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const favorites = await placeModel.getAllPlaces(user);
        res.status(201).json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    addCoordinate,
    addPlace,
    allCoordinates,
    allPlaces,

}