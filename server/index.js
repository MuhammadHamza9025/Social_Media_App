
const cors = require('cors')
const express = require('express')
const cookieparser = require('cookie-parser')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const database = require('./Models/Employee')
const mongoose = require('mongoose')
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3003',
    credentials: true
}))

app.use(express.urlencoded({ extended: false }))
app.use(cookieparser())

mongoose.connect('mongodb://127.0.0.1:27017/fullstack')
    .then(console.log('Databse craeted')).catch((err) => console.log(err))


app.post('/register', async (req, res) => {
    const { name, email, password, conpassword } = req.body;




    const docs = await database.findOne({ email: email })

    const all = await database.find({})

    if (docs) {
        console.log('email already exists..')
        res.json('Email already Registered')





    }
    else {
        if (password === conpassword) {

            const jeson = new database({
                name: name,
                email: email,
                password: password,
                conpassword: conpassword,



            })

            const token = await jeson.generateAuthToken();
            console.log('token for cookie is ', token, {
                // sameSite: secure
            })



            res.cookie("jwt", token, { httpOnly: false, maxAge: 90 * 100000, sameSite: "none", secure: true, expires: new Date(Date.now() * 900) })





            const respo = await jeson.save()
            console.log('This is waoo ', req.cookies.jwt)

            res.json('Registered Successfully')
        }
        else {
            console.log('Password and Confirm Password should be same !')
        }
    }










})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;




    // console.log(email)
    // console.log('your pasword is  ', password)

    const checkmail = await database.findOne({ email: email })

    // console.log('database pwd is ', checkmail.name)
    if (checkmail) {
        const isok = bcrypt.compare(password, checkmail.password)

        const token = await checkmail.generateAuthToken();
        console.log('Login token is ', token)
        res.cookie("logintoken", token, { httpOnly: false, maxAge: 90 * 100000, sameSite: "none", secure: true, expires: new Date(Date.now() * 2 ^ 9000000) })


        if (isok) {
            res.json(checkmail.name)
            console.log('Login Successfull')
            // res.send('exist')
            // res.json('exist')
        }
        else {
            console.log('Wrong Password')
        }
    }
    else {

        console.log('Email not found in Database')
    }



})
app.get('/register', async (req, res) => {
    const d = await database.find().then((data) => res.json(data)).then(console.log('Successfull')).catch(() => console.log('error'))
    console.log(d)
})
app.listen(9002)