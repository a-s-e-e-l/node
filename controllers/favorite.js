const { coordinateModel, placeModel } = require('../models')
const { placeSchema, coordinateSchema } = require('../helpers/validation_schema')
const { Client } = require("@googlemaps/google-maps-services-js");

let blacklist = [];

const addCoordinate = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        } else {
            const request = await coordinateSchema.validateAsync(req.body);
            const client = new Client({});
            await client.geocode({
                params: {
                    latlng: `${request.lat},${request.lng}`,
                    key: "AIzaSyDEsOm9JwBayoz_CuJIslL3ume-ZE8h2B0",
                },
                timeout: 1000, // milliseconds
            })
                .then((geocodeResponse) => {
                    const address = geocodeResponse.data.results[0].formatted_address;
                    const newFavorite = new coordinateModel(request.lat, request.lng, address);
                    newFavorite.save(user);
                    console.log(newFavorite)
                    res.status(201).json({ message: 'Added successfully in Favorite Coordinate List' });
                })
                .catch((geocodeError) => {
                    console.log(geocodeError.response.data.error_message);
                });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
const addPlace = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        } else {
            const request = await placeSchema.validateAsync(req.body);
            const client = new Client({});
            await client.placeDetails({
                params: {
                    place_id: request.place_id,
                    key: "AIzaSyDEsOm9JwBayoz_CuJIslL3ume-ZE8h2B0",
                },
                timeout: 1000, // milliseconds
            })
                .then((placeDetailsResponse) => {
                    const name = placeDetailsResponse.data.result.name;
                    const address = placeDetailsResponse.data.result.formatted_address;
                    const lat = placeDetailsResponse.data.result.geometry.location.lat;
                    const lng = placeDetailsResponse.data.result.geometry.location.lng;
                    const newFavorite = new placeModel(request.place_id, name, address, lat, lng);
                    console.log(newFavorite)
                    newFavorite.save(user);
                    res.status(201).json({ message: 'Added successfully in Favorite Place List' });
                })
                .catch((placeDetailsError) => {
                    console.log(placeDetailsError.response.data.error_message);
                });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const allCoordinates = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        } else {
            const favorites = await coordinateModel.getAllCoordinates(user);
            res.status(201).json(favorites);
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const allPlaces = async (req, res, next) => {
    try {
        const user = req.user.aud;
        if (blacklist.includes(user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        } else {
            const favorites = await placeModel.getAllPlaces(user);
            res.status(201).json(favorites);
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    addCoordinate,
    addPlace,
    allCoordinates,
    allPlaces,

}