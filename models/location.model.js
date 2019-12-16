const mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    address: {
        type: String
    },
    fileName: {
        type: String
    },
    userId: {
        type: String
    }
});

mongoose.model('Location', locationSchema);