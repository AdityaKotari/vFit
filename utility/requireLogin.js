/*
NEEDS db connection


Middleware:
requireLogin - checks if bearer token for a logged-in user is valid
*/
var express = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const con = require('./dbConnection.js')

const requireLogin = (req, res, next) => {
    const {authorization} = req.headers;
    //authorization === Bearer ewefwegwrherhe
    if(!authorization){
        console.log("No auth bearer"); 
       return res.status(401).json({error:"You must be logged in to access this"})
    }

    const token = authorization.replace("Bearer ","")
    
    jwt.verify(token, ""+process.env.JWT_SECRET, (err, payload) => {
        if(err){
            console.log(err);
            return res.status(401).json({error:"You must be logged in to access this"})
        }

        const _id = payload.user_id;
        con.query(`SELECT user_id
                FROM user
                WHERE user_id = ${_id}`,
            function (err, result) {
                console.log(result);
                if(result&&result.length)
                    next()
            }
        );
    });
};

module.exports = requireLogin