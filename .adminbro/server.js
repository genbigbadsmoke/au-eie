const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const multer=require('multer');
const User=require("./user");
const path=require('path')
const cors=require('cors')
const http=require('http')


const hostname = '127.0.0.1';
const PORT = process.env.PORT || 5000; // Step 1

mongoose.connect(process.env.MONGODB_URI || 
    "mongodb+srv://sristi27:Cr0EoTdUalbUHga0@cluster0.r2lu4.mongodb.net/users?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true},
(err) => {
    if (!err) {
        console.log("Database connected");
    } else {
        console.log(err);
    }
})


const app=express();
app.use(bodyparser.urlencoded({extended:false}))
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept,Authorization"
    );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    next();
  });

//method to store image on disks
//images to be stored in uploads
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  });

  const fileFilter=(req, file, cb)=>{
   if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
       cb(null,true);
   }else{
       cb(null, false);
   }

  }

var upload = multer({ 
    storage:storage,
    fileFilter:fileFilter
 });

app.post("/uploadForm",upload.single('myImg'),async (req,res,next)=>
{
    const {name}=req.body;
    if(req.file)
    {const pathName=req.file.path;
    console.log(pathName)
    const newUser=User(
        {
            name:name,
            image:pathName
        }
    )
    const find=await User.findOne({name});
    if(!find)
    {
        const save=await newUser.save();
        try{
            
            res.status(200).json({message:"Saved successfully",data:save})
            
        }catch(err){
            res.status(400).json({message:'User could not be saved'})
        }
    }
    else {
        res.status(400).json({message:'User already exists'})
    }
}
else{
    res.status(400).json({message:'User Image does not exists'})
}
});



if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path=require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}




app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });