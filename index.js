const express = require('express');
const multer = require('multer');
const path = require('path');


const app = express()

const uploads_folder = './uploads/';

//define the stroage
const stroage = multer.diskStorage({
    destination: (req, file, cd)=>{
       //second perameter except path
       cd(null, uploads_folder)
    },
    filename: (req, file, cb) => {
       //Important file.pdf => important-file-klkadaf.pdf
       const fileExt = path.extname(file.originalname)
       console.log('file originalname -> ', file.originalname)
       console.log('fileExt -> ',fileExt)
       const filename = file.originalname
                        .replace(fileExt, "")
                        .toLowerCase()
                        .split(" ")
                        .join("-") + "-" + Date.now()
        
        console.log('filename -> ',filename)

        cb(null, filename + fileExt)
    }
})

//preapre the finel multer upload object
let upload = multer({
   storage: stroage,
   limits: {
    fileSize: 1000000, //1megabyte
   },
   fileFilter: (req, file, cb) => {
    //    console.log('file data in filter -> ', file)
    if(
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ){
        //cb means is a callback function.this fucntion recive two arguments. one argument is null  other argument is true or false
        cb(null, true);
    }
    else{
        cb(new Error("Only .jpg, .png and jpeg format allowed!"))
    }
   }
})

// upload input field is one.if upload one file then use .single('inputfield_name')
// upload input field is one.if upload multiple file then use .array('inputfield_name', maximum_number_of_file)
// upload input field is multiple.if upload multiple file then use .fields([{name: 'inputfield1_name', maxCount: 1}, {name: 'inputfield2_name', maxCount: 2}])

app.post('/', upload.single('avatar'), (req, res) => {
    // console.log('req data -> ',req)
    res.send("hello world")
})


//default error handler
app.use((err, req, res, next) => {
    if(err){
       if(err instanceof multer.MulterError){
        res.status(500).send("There was an upload error!")
       }else{
         res.status(500).send(err.message)
       }
    }
    else{
        res.send("success")
    }
})

app.listen(3000, () => console.log('file upload server is running on port 3000'))