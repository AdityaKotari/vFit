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
  con.query(
    `INSERT INTO user VALUES (DEFAULT, '${username}', '${password}', '${email}', 0, ${city_id}, 0, NULL)`,
    function (err, result) {
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
          token: jwt.sign(
            { user_id: result.insertId },
            process.env.JWT_SECRET,
            {
              expiresIn: jwt_expiry_time,
            }
          ),
        });
      }
    }
  );
});

//logs in a user, requires {username, password}
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ error: "Email or password is missing" });
  }
  con.query(
    `SELECT user_id, password FROM user WHERE username = '${username}'`,
    function (err, result) {
      //console.log(result);
      if (err) throw err;
      if (result.length && result[0].password == password)
        return res.json({
          token: jwt.sign(
            { user_id: result[0].user_id },
            process.env.JWT_SECRET,
            {
              expiresIn: jwt_expiry_time,
            }
          ),
        });
      else return res.json({ error: "Wrong credentials" });
    }

  );
});

//gets user data
router.get("/userData", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));

  con.query(
    `SELECT username, email, city.city_name, city.city_id, score
        FROM user
        INNER JOIN city ON user.city_id = city.city_id
        WHERE user_id = ${payload.user_id}`,
    function (err, result) {
      console.log(result);
      if (err) throw err;
      if (result.length) return res.send(result[0]);
    }
  );
});

router.get("/search", (req, res) => {
  const username = req.query.username;
  var sql = `SELECT user_id, username, email, city.city_id, city.city_name, profile_url, score
  FROM user
  INNER JOIN city ON user.city_id = city.city_id
  WHERE username LIKE '%${username}%'`;
  console.log(req.body);
  con.query(
    sql,
    function (err, result) {
      console.log(result);
      if (err) throw err;
      return res.send(result);
    }
  );
});

router.get("/friends", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  results = { friends: [], incoming: [], outgoing: [] };

  //friends
  con.query(
    `SELECT user.user_id, user.username, user.email, city.city_name, city.city_id, user.profile_url

                FROM friendship
                INNER JOIN user ON user.user_id = friendship.user_id2
                INNER JOIN city ON user.city_id = city.city_id
                WHERE friendship.user_id1 = ${payload.user_id} AND friendship.status = 1
                UNION
                SELECT user.user_id, user.username, user.email, city.city_name, city.city_id, user.profile_url
                FROM friendship
                INNER JOIN user ON user.user_id = friendship.user_id1
                INNER JOIN city ON user.city_id = city.city_id
                WHERE friendship.user_id2 = ${payload.user_id} AND friendship.status = 1`,


    function (err, result) {
      console.log(result);
      if (err) throw err;
      if (result.length) results.friends.push(...result);
      //incoming
      con.query(
        `SELECT user.user_id, user.username, user.email, city.city_name, city.city_id, user.profile_url

                    FROM friendship
                    INNER JOIN user ON user.user_id = friendship.user_id1
                    INNER JOIN city ON user.city_id = city.city_id
                    WHERE friendship.user_id2 = ${payload.user_id} AND friendship.status = 0`,

        function (err, result) {
          console.log(result);
          if (err) throw err;
          if (result.length) results.incoming.push(...result);
          //outgoing
          con.query(
            `SELECT user.user_id, user.username, user.email, city.city_name, city.city_id, user.profile_url
                FROM friendship
                INNER JOIN user ON user.user_id = friendship.user_id2
                INNER JOIN city ON user.city_id = city.city_id
                WHERE friendship.user_id1 = ${payload.user_id} AND friendship.status = 0`,

            function (err, result) {
              console.log("outgoing: ", result);
              if (err) throw err;
              if (result.length) {
                results.outgoing.push(...result);
              }
              return res.send(results);
            }
          );
        }
      );
    }
  );
});

router.post("/friends/add/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const recipient = req.params["user_id"];

  con.query(
    `INSERT INTO friendship VALUES ( ${payload.user_id}, ${recipient}, 0)`,
    function (err, result) {
      console.log(result);
      if (err) throw err;
    }
  );
  return res.send("Request sent");
});

router.put("/friends/accept/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const to_be_accepted = req.params["user_id"];

  con.query(
    `UPDATE friendship SET status = 1 WHERE user_id2 = ${payload.user_id} AND user_id1 = ${to_be_accepted}`,
    function (err, result) {
      console.log(result);
      if (err) throw err;
    }
  );
  return res.send("Request accepted");
});

router.delete("/friends/delete/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const recipient = req.params["user_id"];

  con.query(
    `DELETE from friendship
                WHERE (user_id1 = ${payload.user_id} AND user_id2 = ${recipient})
                OR (user_id2 = ${payload.user_id} AND user_id1 = ${recipient})`,
    function (err, result) {
      console.log(result);
      if (err) throw err;
    }
  );
  return res.send("Deleted friendship");
});

router.get("/chat/:user_id", requireLogin, (req, res) => {
  const { authorization } = req.headers;
  const payload = jwt.decode(authorization.replace("Bearer ", ""));
  const other = req.params["user_id"];

  con.query(
    `SELECT * FROM message
                WHERE (sender_id = ${payload.user_id} AND recipient_id = ${other})
                OR (recipient_id = ${payload.user_id} AND sender_id = ${other})`,
    function (err, result) {
      console.log(result);
      if (err) throw err;
      return res.send(result);
    }
  );
});

module.exports = router;
