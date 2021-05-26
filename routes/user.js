//all places with "pog" need to be replaced with db related code

var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const requireLogin = require('../utility/requireLogin.js')


//adds a new user to db, requires {name, email, password}
router.post('/signup', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!email || !name || !password ||!phone) {
        res.status(422).json({ error: "Some arguments are missing" });
    }
    res.json({"message":"Poggers, signed up"})
})

//logs in a user, requires {email, password}
router.post('/login', (req, res) => {
    const {email, password} = req.body
    if(!email||!password){
        return res.status(422).json({error:"Email or password is missing"});
    }

    res.json({"message":"Poggers, Logged in"})
})

//gets user data
router.get('/userData', requireLogin, (req, res) => {
    const {authorization} = req.headers;
    const id = jwt.decode(authorization.replace("Bearer ",""))
    
    res.json({"message":"Poggers, take your date"})
})

module.exports = router;