
// const express=require('express')
// const app=express()
// const usermodel=require('./models/user')
// const cookieParser = require('cookie-parser')
// const bcrypt=require('bcrypt')
// const jwt=require('jsonwebtoken')
// const path=require('path')
// const port=2000

// app.set('view engine','ejs')
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))


// app.get('/',function(req,res){
//     res.render('index')
// })

// app.get('/profile',(req,res)=>{
//    let user=usermodel.findOne({email: req.params.email})
//    console.log(user)
//     res.render('profile')
//  })

// app.post('/create', function(req,res){
//     let {username,email,password,age}= req.body
// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(password,salt,async (err,hash)=>{
//         // console.log(hash)

//         let createduser=await usermodel.create({
//          username,
//          email,
//         password: hash,
//          age
//   })

//   let token=jwt.sign({email},'ravikumar')
//   res.cookie('token',token)
//   res.redirect('/profile',{createduser})
//     })
// })

// })

// app.get("/login",function(req,res){
//    res.render('login')
// })

// app.post("/login",async function(req,res){
//     let user=await usermodel.findOne({email: req.body.email})
//     console.log(user)
//     if(!user)
//     return res.send('somthing went wrong')

//    bcrypt.compare(req.body.password, user.password, function(err,result){
//     if(result){
//     let token=jwt.sign({email:user.email},'ravikumar')
//     res.cookie('token',token)
//     return res.send('successfully login')
//     }

//     else
//     return res.send('you cant login')
//     console.log(result)
//    })
//  })
 

// app.get("/logout",function(req,res){
//     res.cookie("token", "")
//     res.redirect('/')
// })
// app.listen(port)




const express = require('express');
const app = express();
const usermodel = require('./models/user');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const key=require('./helper/secretkey')
const port = 9000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/profile',isLoggedin, async  (req, res) => {
    let token = req.cookies.token;
    
    if (token) {
        let decoded = jwt.verify(token, 'key');
        let currentUser = await usermodel.findOne({ email: decoded.email });

        let users = await usermodel.find();
       
        console.log(users);
        res.render('profile', { users });
    } else {
        res.redirect('/login');
    }
});


app.post('/create',async function(req, res) {
    let{username,contact, email, password, age }=req.body

    let user= await usermodel.findOne({email})
    if(user)
    return res.status(300).send('User already exist')
 

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) throw err;

            let createduser = await usermodel.create({
                username,
                contact,
                age,
                email,
                password: hash
                
            });

            let token = jwt.sign({ email }, 'key');
            res.cookie('token', token);
            res.redirect('/login');
        });
    });
});

app.get("/login", function(req, res) {
    res.render('login');
});

app.post("/login", async function(req, res) {
    let user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
        return res.send('Something went wrong');
    }

    bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (result) {
            let token = jwt.sign({ email: user.email }, 'key');
            res.cookie('token', token);
            return res.redirect('/game');
        } else {
            return res.send('You can\'t login');
        }
    });
});
app.get('/game',isLoggedin, async function(req,res){
    
    let token = req.cookies.token;
    if (token) {
        let decoded = jwt.verify(token, 'key');
        let currentUser = await usermodel.findOne({ email: decoded.email });
        res.render('stone',{currentUser})
    }
    
})
app.get("/logout", function(req, res) {
    res.cookie("token", "");
    res.redirect('/');
});


function isLoggedin(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, 'key', (err, data) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.redirect('/login');
        }
        req.users = data;
        next();
    });
 }

app.listen(port);
