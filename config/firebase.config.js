const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const firebaseConfig = {
  firebaseConfig: {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGEID,
    appId: process.env.APPID,
    measurementId: process.env.MESSUREID,
  },
};

module.exports = firebaseConfig;
