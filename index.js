const express = require('express')
const app = express()
const path = require('path');

require('dotenv').config(); 

const router = (global.router = (express.Router()));
const port = process.env.PORT || 5000; 
var cors = require('cors')

// app.use(cors());
app.use(express.json());

 

app.use('/api/user', require('./routes/user.js'));
app.use('/api/room', require('./routes/room.js'));
app.use(router);

app.use(express.static(path.join(__dirname, 'frontend/build'))); 
app.use("/posenet_models", express.static(__dirname + "/posenet_models"));

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`vFit server listening at http://localhost:${port}`);
});
