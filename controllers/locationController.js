const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const config = require('../config/config');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const connection = mongoose.createConnection('mongodb://localhost:27017/myAppTwo');
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
    url: 'mongodb://localhost:27017/myAppTwo',
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

router.get('/', (req, res) => {
    console.log("Here");
    Location.find((err, docs) => {
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

module.exports = router;