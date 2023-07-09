const express = require('express');
const route = require('./src/routes/route');
const  mongoose  = require('mongoose');
const app = express();
const dotenv = require('dotenv').config();
const mongo_password = process.env.MONGO_KEY
app.use(express.json());

mongoose.connect(`mongodb+srv://BiswajitSwain:${mongo_password}@cluster0.xf1eq.mongodb.net/LIKES_SERVICE_V1`, {useNewUrlParser: true})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.use('/', route)

app.listen(3000, function () {
    console.log('Express is running on port ' + 3000)
});



