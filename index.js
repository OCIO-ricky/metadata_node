// call all the required packages
const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser')
const multer = require('multer');
const fs = require('fs');
const FileChunked = require('file-chunked');
const port = 3000;

// SET STORAGE
//const upload = multer({ dest: '/tmp' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
 
var upload = multer({ storage: storage });

//CREATE EXPRESS APP
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
 
app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  

//app.post('/upload', function (req, res) {
app.post('/upload',upload.single('file'), (req, res, next) => {
  const {file, body} = req;

//console.log(req.file.originalname);
//console.log(body);
    if(body.chunking == 'true'){

        FileChunked.upload({
            chunkStorage:'/tmp/', // where the uploaded file(chunked file in this case) are saved
            uploadId: body.uploadId,
            chunkIndex: body.chunkIndex,
            totalChunksCount: body.totalChunksCount,
            originalname: req.file.originalname,
            filePath: req.file.path,
        });
    }
    
  res.json({ message: 'WELCOME' });
  
})

app.listen(port, () => console.log('Server started on port 3000'));

//
//
//line 77 added to file FileChunked.js:
//      fs.renameSync(file.filePath, file.chunkStorage+file.originalname); // <== LINE ADDDED
//