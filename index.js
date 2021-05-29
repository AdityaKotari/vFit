const express = require("express")
const app = express()
const path = require("path")

require("dotenv").config()

const router = (global.router = express.Router())
const port = process.env.PORT || 5000
var cors = require("cors")

app.use(cors())
app.use(express.json())

app.set("view engine", "ejs")

app.use(express.static(__dirname + '/public'));

app.use("/api/user", require("./routes/user.js"))
app.use("/api/room", require("./routes/room.js"))
app.use(router)

app.get("/", (req, res) => {
    res.render("index")
})

app.use(express.static(path.join(__dirname, 'frontend/build'))); 
app.use("/public", express.static(__dirname + "/public"));
app.get("/friendplay", (req, res) => {
    res.render("friendplay")
})

app.get("/soloplay", (req, res) => {
    res.render("soloplay")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.listen(port, () => {
    console.log(`vFit server listening at http://localhost:${port}`)
})
