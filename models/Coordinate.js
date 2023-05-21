const firebase = require('../configrations/db')
const { v4: uuidv4 } = require('uuid');
const firestore = firebase.firestore();
class Coordinate {
    constructor(lat, lng, address) {
        this.id = uuidv4();
        this.lat = lat;
        this.lng = lng;
        this.address = address;
        this.created_at = new Date();
    }
    async save(userId) {
        const userRef = firestore.collection('users').doc(userId);
        const favoriteRef = userRef.collection('coordinate').doc(this.id);
        // Save the Favorite instance to Firestore
        await favoriteRef.set({
            id: this.id,
            lat: this.lat,
            lng: this.lng,
            address: this.address,
            created_at: this.created_at,
        });
    }
    static async getAllCoordinates(userId) {
        const userRef = firestore.collection('users').doc(userId);
        const favoritesRef = userRef.collection('coordinate');
        const snapshot = await favoritesRef.get();
        return snapshot.docs.map((doc) => doc.data());
    }
}

module.exports = Coordinate