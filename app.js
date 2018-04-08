const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
var vision = require('@google-cloud/vision');
var cloud = require('google-cloud');
var fs = require('fs');
const path = require('path');

const client = new vision.ImageAnnotatorClient();


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 100000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}


// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.get('/vision', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('vision', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
          var vision = 11333;
          console.log(vision);
          function visionFunc(){
              //console.log(`uploads/${req.file.filename}`);
              var fileName = req.file.destination + req.file.filename;
              //console.log(req.file);
              client
                  .documentTextDetection(fileName)
                  .then(results => {
                      const fullTextAnnotation = results[0].fullTextAnnotation;
                      //console.log(fullTextAnnotation.text);
                      vision = fullTextAnnotation.text
                      //console.log(vision);


                      arr = vision.split('\n')
                      console.log(arr);
                      for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == '[B]') {
                          arr[i] = '<button>Test</button>'
                          console.log(arr[i]);
                        }

                        }
                        vision = ''
                        for (var i = 0; i < arr.length; i++) {
                          arr[i] = arr[i] + '\n'
                          vision = vision + arr[i]
                        }

                        res.redirect('/render?file=' + '?vision=' + vision)
                  })
                  .catch(err => {
                      console.error('ERROR:', err);
                  });
          }
          visionFunc();

      }
    }
  });
});


app.get('/render', function(req, res){

  res.render('render', {
    vision: req.param('vision')
  })

})

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
