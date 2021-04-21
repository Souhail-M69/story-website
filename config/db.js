const mongoose = require("mongoose");

require('dotenv').config({path: './config.env'})
//Async because mongoose work with promises
const connectDb = async () => {
  try {
    // try connection and await cause is return promise
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      //option to avoid error in console
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });


    //connected 

    console.log(`mongo db connected : ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
      process.exit(1)
  }
};

//use in app.js
module.exports = connectDb
