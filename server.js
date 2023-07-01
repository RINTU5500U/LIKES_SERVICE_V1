const express = require('express');
const route = require('./src/routes/route');
const  mongoose  = require('mongoose');
const app = express();
const PORT = 3000
app.use(express.json());

mongoose.connect("mongodb+srv://BiswajitSwain:EtERzBKu3NLVQlzp@cluster0.xf1eq.mongodb.net/LIKES_SERVICE_V1", {useNewUrlParser: true})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.use('/', route)

app.listen(PORT, function () {
    console.log('Express is running on port ' + PORT)
});