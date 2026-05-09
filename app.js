const express = require('express')
const app = express()
const path = require('path')
const userModel = require('./models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const post = require('./models/post')
const cookieParser = require('cookie-parser')
app.set("view engine","ejs")
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.get("/",(req, res)=>{
    res.render("index")
})
app.get("/login",(req, res)=>{
    res.render("login")
})

app.post("/login", async (req, res)=>{
    let {email,password} = req.body
    let user = await userModel.findOne({email})
    if(!user) return res.status(500).send("Something went wrong")
    bcrypt.compare(password, user.password , (err,result)=>{
        if(result) {
            let token = jwt.sign({email: email, userid: user._id},"shhh")
            res.cookie("token",token)
            res.status(200).send("You can login")
        }
        else res.redirect("/login")
    })
})
app.get("/profile",isLoggedIn,(req,res)=>{
    res.render("login")
})
app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/login")
})
app.post("/register", async (req, res)=>{
    let {name,username,email,age,password} = req.body
    let user = await userModel.findOne({email})
    if(user) return res.status(500).send("User already resgitered")
    bcrypt.genSalt(10,(err,salt)=> {
        bcrypt.hash(password,salt,async (err,hash)=>{
            let createdUser = await userModel.create({
                name,
                username,
                email,
                age,
                password: hash
            })
           let token = jwt.sign({email: email, userid: user._id},"shhh")
           res.cookie("token",token)

        })
    })
    res.redirect("/")
})
function isLoggedIn(req,res,next) {
    if(req.cookies.token === "") res.send("You need to login first")
    else{
        let data = jwt.verify(req.cookies.token,"shhh")
        req.user = data
        next();
    }
}

app.listen(3000)