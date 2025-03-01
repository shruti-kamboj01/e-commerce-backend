const mongoose = require('mongoose');
require("dotenv").config();

const dbConnect = async () => {
    await mongoose.connect(process.env.db_url)
    try{console.log("Db connection successfull")}
    catch(error) {
        console.log("Issue in Db connection")
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = dbConnect