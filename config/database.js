const mongoose = require('mongoose')
const connectToDatabase =()=> mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
}).then(con => console.log(`Database Connected Successfully on HOST: ${con.connection.host}`));

module.exports = connectToDatabase;