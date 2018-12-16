var admin = require("firebase-admin");
var serviceAccount = require("./creds");

const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

admin.initializeApp(config);
const database = admin.database();

exports.database = database;
