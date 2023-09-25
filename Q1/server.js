const express = require('express')
const app = express();
const multer = require('multer')
var fs = require('fs')
var path = require('path')

var Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destFolder = './uploads'
        //check if folder exist or not
        if (fs.existsSync(destFolder)) {
            callback(null, destFolder)
        } else {
            fs.mkdir(destFolder, (err) => {
                err ? console.error(err.stack) : callback(null, destFolder)
            })
        }
    },
    filename: (req, file, callback) => {
        callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})  

const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg", "image/gif"]

var upload = multer({
    storage: Storage, fileFilter: (req, file, callback) => {
        if (acceptedTypes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(null, false)
            return callback(`only ${acceptedTypes.toString(',')} format allowed`)
        }
    }
})

app.post('/upload_single', upload.single('userFile'), (req, res) => {
    return res.send(<h1>'file is uploaded'</h1>);
})

app.post('/upload_multiple', upload.array('userFiles', 4), (req, res) => {
    return res.send('files uploaded successfully.');
})

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/views/index.html');
})

app.use(function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
        console.log("ERRRR");
        res.status(500).send("file upload  err " + err.message);
    }
    else
        next(err);
});


app.listen(8000, () => {
    console.log(`App listening`)
})