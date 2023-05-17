// const {initializeApp, cert} = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");

// const credentials = require("../mapbookmark-f5d1b-firebase-adminsdk-tkqlx-03d472854d.json");

// initializeApp({
//     credential: cert(credentials)
// });
// const db = getFirestore();
// module.exports = {db}





const firebase = require('firebase');
const config = require('../config');

const db = firebase.initializeApp(config.firebaseConfig);
module.exports = db
