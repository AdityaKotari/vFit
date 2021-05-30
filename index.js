//dependencies and setup
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
app.use("/public", express.static(__dirname + "/public"));
//^idk why there are two. I am not touching this because some path somewhere will break.



//backend routes
app.use("/api/user", require("./routes/user.js"))
app.use("/api/room", require("./routes/room.js"))
app.use(router)

//frontend routes
app.get("/", (req, res) => {
    res.render("index")
})
app.get("/friendplay/:roomcode", (req, res) => {
    res.render("friendplay", {room_code: req.params.roomcode})
})
app.get("/soloplay", (req, res) => {
    res.render("soloplay")
})
app.get("/signup", (req, res) => {
    res.render("signup")
})
app.get("/sockdemo", (req, res) => {
    res.render("sockdemo")
})
app.get("/room_details", (req, res) => {
    res.render("room_details")
})
app.get("/profile/:user_id", (req, res) => {
    res.render("profile", {user_id: req.params.user_id})
})

//socket.io
var server=require('http').Server(app);
const io=require('socket.io')(server, {
    cors: {origin: "*"}
});

io.on("connection", (socket) => {
    console.log("someone connected to a socket")

    socket.on("public_message", public_message => {
        io.emit("public_message", socket.id.substr(0,2)+" said "+public_message)
    })

    socket.on("join_room", (room_code) => {
        console.log("user joined room "+room_code)
        socket.join(room_code);
        io.to(room_code).emit('share_id');
    });
    socket.on("share_id2", (room_code, id) => {
        io.to(room_code).emit("webrtc_id", id);
        console.log("room "+room_code+ " id "+id )
    });
    socket.on("update_score", (username, pose_count, room_code) => {
        io.to(room_code).emit("updated_score", username, pose_count, room_code);
        console.log("score change at room "+room_code+ " id "+id )
    });

    socket.on("sending_new_message", (room_code, message) => {
        io.to(room_code).emit("new_message", message);
        console.log("room "+room_code+ " message "+message )
    });
    
    

})



server.listen(port, () => {
    console.log(`vFit server listening at http://localhost:${port}`)
})




