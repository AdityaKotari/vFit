var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../utility/requireLogin.js");
const con = require("../utility/dbConnection.js");
const jwt_expiry_time = "3 days";

//adds a new user to db, requires { username, password, email, city_id }
router.post("/signup", (req, res) => {
  const { username, password, email, city_id } = req.body;
  if (!username || !password || !email || !city_id) {
    return res.status(422).json({ error: "Some arguments are missing" });
  }
  var sql =
    "INSERT INTO user VALUES (DEFAULT, " +
    con.escape(username) +
    ", " +
    con.escape(password) +
    ", " +
    con.escape(email) +
    ", 0, " +
    con.escape(city_id) +
    ", 0, NULL)";
  con.query(sql, function (err, result) {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "Email or username already exists" });
      }
      console.log(err);
    } else {
      console.log(result);
      return res.json({
        token: jwt.sign({ user_id: result.insertId }, process.env.JWT_SECRET, {
          expiresIn: jwt_expiry_time,
        }),
      });
    }
  });
});

//logs in a user, requires {username, password}
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ error: "Email or password is missing" });
  }
  var sql =
    "SELECT user_id, password FROM user WHERE username = " +
    con.escape(username);
  con.query(sql, function (err, result) {
    //console.log(result);
    if (err) throw err;
    if (result.length && result[0].password == password)
      return res.json({
        user_id: result[0].user_id,
        token: jwt.sign(
          { user_id: result[0].user_id },
          process.env.JWT_SECRET,
          {
            expiresIn: jwt_expiry_time,
          }
        ),
      });
    else return res.json({ error: "Wrong credentials" });
  });
});

//gets user data
router.get("/userData", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  var sql =
    "SELECT username, email, city.city_name, city.city_id, score FROM user INNER JOIN city ON user.city_id = city.city_id WHERE user_id = " +
    con.escape(payload.user_id);
  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
    if (result.length) return res.send(result[0]);
    else return res.send("No user found");
  });
});

//gets user data
router.get("/userData/:user_id", requireLogin, (req, res) => {
  const user_id = req.params["user_id"];
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));

  results = { connection: 0, details: {} };
  sql1 =
    "SELECT username, email, city.city_name, city.city_id, score FROM user INNER JOIN city ON user.city_id = city.city_id WHERE user_id = " +
    con.escape(user_id);
  sql2 =
    "SELECT * FROM friendship WHERE (user_id1 = " +
    con.escape(user_id) +
    " AND user_id2 = " +
    con.escape(payload.user_id) +
    ") OR (user_id2 = " +
    con.escape(user_id) +
    " AND user_id1 = " +
    con.escape(payload.user_id) +
    ")";
  con.query(sql1, function (err, result) {
    console.log(result);
    if (err) throw err;
    if (result.length) results.details = result[0];
    else return res.send("No user found");
    con.query(sql2, function (err, result) {
      console.log(result);
      if (err) throw err;
      if (result.length) {
        if (result[0].status == 1) {
          results.connection = 1;
        } else if (result[0].user_id1 == user_id) {
          results.connection = 2;
        } else results.connection = 3;
      }
      res.send(results);
    });
  });
});

router.get("/search", (req, res) => {
  const username = req.query.username;
  var sql =
    "SELECT user_id, username, email, city.city_id, city.city_name, profile_url, score " +
    "FROM user " +
    "INNER JOIN city ON user.city_id = city.city_id " +
    "WHERE username LIKE '%" +
    username.replace("'", "").replace("\"", "") +
    "%'";
  console.log(req.body);
  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
    return res.send(result);
  });
});

router.get("/friends", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  results = { friends: [], incoming: [], outgoing: [] };

  var sql1 =
    "SELECT user.user_id, user.username, user.email, city.city_name, city.city_id, user.profile_url " +
    "FROM friendship " +
    "INNER JOIN user ON user.user_id = friendship.user_id2 " +
    "INNER JOIN city ON user.city_id = city.city_id " +
    "WHERE friendship.user_id1 = " +
    con.escape(payload.user_id) +
    " AND friendship.status = 1 " +
    "UNION " +
  "SELECT user.user_id, user.username, user.email, city.city_name, city.city_id, user.profile_url " +
  "FROM friendship " + 
  "INNER JOIN user ON user.user_id = friendship.user_id1 " +
  "INNER JOIN city ON user.city_id = city.city_id " +
  "WHERE friendship.user_id2 = " +
    con.escape(payload.user_id) +
    " AND friendship.status = 1";
  //friends
  con.query(sql1, function (err, result) {
    console.log(result);
    if (err) throw err;
    if (result.length) results.friends.push(...result);
    var sql2 =
      "SELECT user.user_id, user.username, user.email, city.city_name, city.city_id, user.profile_url " +
      "FROM friendship " +
      "INNER JOIN user ON user.user_id = friendship.user_id1 " +
      "INNER JOIN city ON user.city_id = city.city_id " +
      "WHERE friendship.user_id2 = " +
      con.escape(payload.user_id) +
      " AND friendship.status = 0 ";
    //incoming
    con.query(sql2, function (err, result) {
      console.log(result);
      if (err) throw err;
      if (result.length) results.incoming.push(...result);
      var sql3 =
        "SELECT user.user_id, user.username, user.email, city.city_name, city.city_id, user.profile_url " +
        "FROM friendship " +
        "INNER JOIN user ON user.user_id = friendship.user_id2 " +
        "INNER JOIN city ON user.city_id = city.city_id " +
        "WHERE friendship.user_id1 = " +
        con.escape(payload.user_id) +
        " AND friendship.status = 0";
      //outgoing
      con.query(sql3, function (err, result) {
        console.log("outgoing: ", result);
        if (err) throw err;
        if (result.length) {
          results.outgoing.push(...result);
        }
        return res.send(results);
      });
    });
  });
});

router.post("/friends/add/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const recipient = req.params["user_id"];

  var sql =
    "INSERT INTO friendship VALUES ( " +
    con.escape(payload.user_id) +
    ", " +
    con.escape(recipient) +
    ", 0)";
  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
  });
  return res.send("Request sent");
});

router.put("/friends/accept/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const to_be_accepted = req.params["user_id"];
  var sql =
    "UPDATE friendship SET status = 1 WHERE user_id2 = " +
    con.escape(payload.user_id) +
    " AND user_id1 = " +
    con.escape(to_be_accepted);
  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
  });
  return res.send("Request accepted");
});

router.delete("/friends/delete/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const recipient = req.params["user_id"];
  var sql =
    "DELETE from friendship " +
    "WHERE (user_id1 = " +
    con.escape(payload.user_id) +
    " AND user_id2 = " +
    con.escape(recipient) +
    ") " +
    "OR (user_id2 = " +
    con.escape(payload.user_id) +
    " AND user_id1 = " +
    con.escape(recipient) +
    ") ";

  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
  });
  return res.send("Deleted friendship");
});

router.get("/chat/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const other = req.params["user_id"];
  var sql =
    "SELECT * FROM message " +
    "WHERE (sender_id = " +
    con.escape(payload.user_id) +
    " AND recipient_id = " +
    con.escape(other) +
    ") " +
    "OR (recipient_id = " +
    con.escape(payload.user_id) +
    " AND sender_id = " +
    con.escape(other) +
    ") ORDER BY timestamp";

  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
    return res.send(result);
  });
});

router.post("/chat/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const other = req.params["user_id"];
  const { content, timestamp } = req.body;
  var sql =
    "INSERT INTO message " +
    "VALUES (DEFAULT, " +
    con.escape(payload.user_id) +
    ", " +
    con.escape(other) +
    ", " +
    con.escape(content) +
    ", " +
    con.escape(timestamp) +
    ")";

  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
    return res.send("Added to db");
  });
});

module.exports = router;
