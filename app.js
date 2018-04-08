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
  limits:{fileSize: 10485750},
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
                      arr2 = results[0].textAnnotations
                      arr = vision.split('\n')
                      lastElm = false
                      console.log(arr);
                      arr3 = []
                      arr4 = []
                      for (var j = 0; j < arr2.length; j++) {
                          // arr3.push(arr2[j].boundingPoly.vertices[0])
                          console.log(arr2[j]);
                      }
                      console.log(arr3);
                      for (var i = 0; i < arr.length; i++) {

                        if ((arr[i].includes('[BP]') || arr[i].includes('(BP)') || arr[i].includes('[BP)') || arr[i].includes('(BP]')
                        || arr[i].includes('(BP') || arr[i].includes('BP)') || arr[i].includes('BP]') || arr[i].includes('[BP') ) && arr[i] != '[BP]')  {

                          // arr[i].includes('[BP]') ? arr[i] = `<ul><li style=" margin-top: ` + arr4[i].y + 'px;margin-left:' + arr4[i].x + 'px">' + arr[i].split('[BP]')[1] + '</li></ul>' : console.log('bp');
                          arr[i].includes('(BP]') ? arr[i] =  '<ul><li>' + arr[i].split('(BP]')[1] + '</li></ul>' : console.log('');
                          arr[i].includes('[BP)') ? arr[i] =  '<ul><li>' + arr[i].split('[BP)')[1] + '</li></ul>' : console.log('');
                          arr[i].includes('(BP)') ? arr[i] =  '<ul><li>' + arr[i].split('(BP)')[1] + '</li></ul>' : console.log('');
                          arr[i].includes('BP)') ? arr[i] =  '<ul><li>' + arr[i].split('BP)')[1] + '</li></ul>' : console.log('')
                          arr[i].includes('(BP') ? arr[i] =  '<ul><li>' + arr[i].split('(BP')[1] + '</li></ul>' : console.log('')
                          arr[i].includes('BP]') ? arr[i] =  '<ul><li>' + arr[i].split('BP]')[1] + '</li></ul>' : console.log('')
                          arr[i].includes('[BP') ? arr[i] =  '<ul><li>' + arr[i].split('[BP')[1] + '</li></ul>' : console.log('')

                        }
                          else if ((arr[i].includes('[B]') || arr[i].includes('(B)') || arr[i].includes('[B)') || arr[i].includes('(B]')
                          || arr[i].includes('(B') || arr[i].includes('B)') || arr[i].includes('B]') || arr[i].includes('[B') ) && arr[i] != '[B]')  {
                          arr[i].includes('[B]') ? arr[i] =  '<button class="btn btn-info">' + arr[i].split('[B]')[1] + '</button>' : console.log('button')
                          arr[i].includes('(B]') ? arr[i] =  '<button class="btn btn-info">' + arr[i].split('(B]')[1] + '</button>' : console.log('')
                          arr[i].includes('[B)') ? arr[i] =  '<button class="btn btn-info">' + arr[i].split('[B)')[1] + '</button>' : console.log('')
                          arr[i].includes('(B)') ? arr[i] =  '<button class="btn btn-info">' + arr[i].split('(B)')[1] + '</button>' : console.log('')
                          arr[i].includes('B)') ? arr[i] =  '<button class="btn btn-info">' + arr[i].split('B)')[1] + '</button>' : console.log('')
                          arr[i].includes('(B') ? arr[i] =  '<button class="btn btn-info">' + arr[i].split('(B')[1] + '</button>' : console.log('')
                          arr[i].includes('B]') ? arr[i] =  '<button class="btn btn-info">' + arr[i].split('B]')[1] + '</button>' : console.log('')
                          arr[i].includes('[B') ? arr[i] =  '<button class="btn btn-info">' + arr[i].split('[B')[1] + '</button>' : console.log('')

                        }


                        else if ((arr[i].includes('[H]') || arr[i].includes('(H)') || arr[i].includes('[H)') || arr[i].includes('(H]')
                        || arr[i].includes('(H') || arr[i].includes('H)') || arr[i].includes('H]') || arr[i].includes('[H') ) && arr[i] != '[H]')  {
                          arr[i].includes('[H]') ?  arr[i] = '<h1>' + arr[i].split('[H]')[1] + '</h1>' : console.log('')
                          arr[i].includes('(H]') ?  arr[i] = '<h1>' + arr[i].split('(H]')[1] + '</h1>' : console.log('')
                          arr[i].includes('[H)') ?  arr[i] = '<h1>' + arr[i].split('[H)')[1] + '</h1>' : console.log('')
                          arr[i].includes('(H)') ?  arr[i] = '<h1>' + arr[i].split('(H)')[1] + '</h1>' : console.log('')
                          arr[i].includes('H)') ? arr[i] =  '<h1>' + arr[i].split('H)')[1] + '</h1>' : console.log('')
                          arr[i].includes('(H') ? arr[i] =  '<h1>' + arr[i].split('(H')[1] + '</h1>' : console.log('')
                          arr[i].includes('H]') ? arr[i] =  '<h1>' + arr[i].split('H]')[1] + '</h1>' : console.log('')
                          arr[i].includes('[H') ? arr[i] =  '<h1>' + arr[i].split('[H')[1] + '</h1>' : console.log('')

                        }

                        else if ((arr[i].includes('[IN]') || arr[i].includes('(IN)') || arr[i].includes('[IN)') || arr[i].includes('(IN]')
                        || arr[i].includes('(IN') || arr[i].includes('IN)') || arr[i].includes('IN]') || arr[i].includes('[IN') ) && arr[i] != '[IN]')  {
                            arr[i].includes('[IN]') ? arr[i] =  '<input class="form-control" placeholder="' + arr[i].split('[IN]')[1] + '"> </input>' : console.log('inp');
                            arr[i].includes('(IN]') ? arr[i] =  '<input class="form-control" placeholder="' + arr[i].split('(IN]')[1] + '"> </input>' : console.log('');
                            arr[i].includes('[IN)') ? arr[i] =  '<input class="form-control" placeholder="' + arr[i].split('[IN)')[1] + '"> </input>' : console.log('');
                            arr[i].includes('(IN)') ? arr[i] =  '<input class="form-control" placeholder="' + arr[i].split('(IN)')[1] + '"> </input>' : console.log('');
                            arr[i].includes('IN)') ? arr[i] =  '<input class="form-control" placeholder="' + arr[i].split('IN)')[1] + '"> </input>' : console.log('')
                            arr[i].includes('(IN') ? arr[i] =  '<input class="form-control" placeholder="' + arr[i].split('(IN')[1] + '"> </input>' : console.log('')
                            arr[i].includes('IN]') ? arr[i] =  '<input class="form-control" placeholder="' + arr[i].split('IN]')[1] + '"> </input>' : console.log('')
                            arr[i].includes('[IN') ? arr[i] =  '<input class="form-control" placeholder="' + arr[i].split('[IN')[1] + '"> </input>' : console.log('')

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
