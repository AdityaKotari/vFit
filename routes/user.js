//all places with "pog" need to be replaced with db related code

var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const requireLogin = require('../utility/requireLogin.js')
const con = require('../utility/dbConnection.js')
const jwt_expiry_time = "3 days"

//adds a new user to db, requires { username, password, email, city_id }
router.post('/signup', (req, res) => {
    const { username, password, email, city_id } = req.body;
    if (!username || !password || !email || !city_id) {
        return res.status(422).json({ error: "Some arguments are missing" });
    }
    con.query(`INSERT INTO user VALUES (DEFAULT, '${username}', '${password}', '${email}', 0, ${city_id}, 0)`, function (err, result) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "Email or username already exists"});
            }
        }
        else {
            console.log(result);
            return res.send(
                jwt.sign(
                    { user_id: result.insertId },
                    process.env.JWT_SECRET,
                    {expiresIn: jwt_expiry_time}
                )
            );
        }
    });
})

//logs in a user, requires {email, password}
router.post('/login', (req, res) => {
    const {username, password} = req.body
    if(!username||!password){
        return res.status(422).json({error:"Email or password is missing"});
    }
    con.query(`SELECT user_id, password FROM user WHERE username = '${username}'`, function (err, result) {
        console.log(result);
        if (err) throw err;
        if(result.length && result[0].password == password)
            return res.send(
                jwt.sign(
                    { user_id: result[0].user_id },
                    process.env.JWT_SECRET,
                    {expiresIn: jwt_expiry_time}
                )
            );
        else
            return res.send("Wrong credentials");
    });
})

//gets user data
router.get('/userData', requireLogin, (req, res) => {
    const {authorization} = req.headers;
    const payload = jwt.decode(authorization.replace("Bearer ",""))

    con.query(`SELECT username, email, city.city_name, city.city_id, score
                FROM user
                INNER JOIN city ON user.city_id = city.city_id
                WHERE user_id = ${payload.user_id}`,
        function (err, result) {
            console.log(result);
            if (err) throw err;
            if(result.length)
                return res.send(result[0]);
        }
    );
})

module.exports = router;