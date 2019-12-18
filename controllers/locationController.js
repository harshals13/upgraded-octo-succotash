const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const config = require('../config/config');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const connection = mongoose.createConnection('mongodb+srv://dbUser:WcqmtZqYTwpwFlZV@cluster0-rmn8p.mongodb.net/test?retryWrites=true&w=majority');
const path = require('path');
const Location = mongoose.model('Location');
let gfs;

connection.once('open', ()=> {
    // Init stream
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
var storage = new GridFsStorage({
    url: 'mongodb+srv://dbUser:WcqmtZqYTwpwFlZV@cluster0-rmn8p.mongodb.net/test?retryWrites=true&w=majority',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

const options = {
    headers: {
      'user-key': config.userKey
    }
};

// Get location details
router.get('/', (req, res) => {
    console.log("details");
    Location.findOne({_id: req.query.id},(err, docs) => {
        if(!err) {
            res.json({
                status: 0,
                response: docs
            });
        } else {
            res.json({
                status: 999,
                response: err
            });
        }
    })
});

// Get locations of a user
router.get('/:userId', (req, res) => {
    console.log("UserId");
    Location.find({userId: req.params.userId},(err, docs) => {
        if(!err) {
            res.json({
                status: 0,
                response: docs
            });
        } else {
            res.json({
                status: 999,
                response: err
            });
        }
    })
});

router.get('/name/search', (req, res) => {
    console.log("search");
    Location.find({name: req.query.keyword},(err, docs) => {
        if(!err) {
            res.json({
                status: 0,
                response: docs
            });
        } else {
            res.json({
                status: 999,
                response: err
            });
        }
    })
});

// @route POST /upload
// Uploads file to DB
router.post('/', upload.single('image'), (req, res, next) => {
    let location = new Location();
    location.name = req.body.name;
    location.description = req.body.description;
    location.address = req.body.address;
    location.fileName = req.file.filename;
    location.userId = req.body.userId;

    location.save((err, doc) => {
        if(!err) {
            res.json({
                status: 0,
                response: doc
            });
        } else {
            res.json({
                status: 999,
                response: err
            });
        }
    });
});

// @route POST /upload
// Uploads file to DB
router.post('/update',upload.single('image'),(req, res, next) => {

    Location.findOne({_id: req.body.id}, function(err, location) {
        if(!err) {
            if(!location) {
                location = new Location();
                location.name = req.body.name;
                location.description = req.body.description;
                location.address = req.body.address;
                location.fileName = req.file.filename;
                location.userId = req.body.userId;
                location.fileName = req.file.filename;
            }
            location.fileName = req.file.filename;
            location.name = req.body.name;
            location.description = req.body.description;
            location.address = req.body.address;
            location.save(function(err, doc) {
                if(!err) {
                    res.json({
                        status: 0,
                        response: doc
                    });
                } else {
                    res.json({
                        status: 999,
                        response: err
                    });
                }
            });
        }
    });
});

router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file is present
        if(!file || file.length === 0) {
            return res.status(404).json({
                error: 'No file exists'
            });
        }

        // Check if image
        if( file.contentType === 'image/jpeg' || file.contentType === 'img/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(options);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                error: 'Not an Image'
            })
        }
    })
})

router.post('/delete/:id', (req, res) => {
    Location.remove({ _id: req.params.id }, function(err) {
        if(!err) {
            res.json({
                status: 0,
                response: 'Deleted'
            });
        } else {
            res.json({
                status: 999,
                response: err
            });
        }
    });
})

module.exports = router;