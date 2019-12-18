const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbUser:WcqmtZqYTwpwFlZV@cluster0-rmn8p.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB connection Succeeded') }
    else { console.log('Error in DB connection : ' + err)}
});