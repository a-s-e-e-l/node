const firebase = require('../configrations/db')
const { v4: uuidv4 } = require('uuid');
const firestore = firebase.firestore();
class Place {
    constructor(place_id, name,address,lat,lng) {
        this.id = uuidv4();
        this.place_id = place_id;
        this.name = name;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
        this.created_at = new Date();
    }
    async save(userId) {
        const userRef = firestore.collection('users').doc(userId);
        const favoriteRef = userRef.collection('place').doc(this.id);
        // Save the Favorite instance to Firestore
        await favoriteRef.set({
            id: this.id,
            place_id: this.place_id,
            name: this.name,
            address: this.address,
            lat: this.lat,
            lng: this.lng,
            created_at: this.created_at,
        });
    }
    static async getAllPlaces(userId) {
        const userRef = firestore.collection('users').doc(userId);
        const favoritesRef = userRef.collection('place');
        const snapshot = await favoritesRef.get();
        return snapshot.docs.map((doc) => doc.data());
    }
}

module.exports = Place