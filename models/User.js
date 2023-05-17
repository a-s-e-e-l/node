const firebase = require('../configrations/db')
const { v4: uuidv4 } = require('uuid');
const firestore = firebase.firestore();
const bcrypt = require('bcrypt');
class User {
  constructor(name, email, password) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
  async save() {
    const userRef = firestore.collection('users').doc(this.id);
    await userRef.set({
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      created_at: this.created_at,
      updated_at: this.updated_at,
    });
  }
  static async bcryptPass(pass) {
    const hashPass = await bcrypt.hash(pass, 10);
    return hashPass;
  }
  static async isValidPass(pass1,pass2) {
    try {
      const valid = await bcrypt.compare(pass1, pass2);
      return valid;
    } catch (error) {
      throw error;
    }
  }
  static async findByEmail(email) {
    try {
      const userQuerySnapshot = await firestore.collection('users').where('email', '==', email).get();
      if (userQuerySnapshot.empty) {
        return null;
      } else {
        const userData = userQuerySnapshot.docs[0].data();
        const user = new User(userData.name, userData.email, userData.password);
        user.id = userData.id;
        user.created_at = userData.created_at;
        user.updated_at = userData.updated_at;
        return user;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching user from database');
    }
  }
}

module.exports = User
