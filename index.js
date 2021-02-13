const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const dontenv = require('dotenv');
const _PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

dontenv.config();

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true, },
    (err) => {
        if(!err) console.log('MongoDB Connection')
        else console.log(err)
    })
app.use(express.json())
app.options('*', cors())
// CORS
app.use(cors({
    origin: '*', //192.168.43.121,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}))
// Import Router
const authRoute = require('./routes/auth');
const empRoute = require('./routes/users')
const markAttendanceRoute = require('./routes/mark-attendance')
const geoFence = require('./routes/add-geo-fence')

// Route Middlewares
app.use('/api/admin', authRoute)
app.use('/api/admin/user', empRoute)
app.use('/api/mark-attendance', markAttendanceRoute)
app.use('/api/geo-fence', geoFence)

// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// )



// Root Route
app.get('/', (req, res) => {
    res.json({ message: "Procohat EMS : MongoDB, Express,Angualr, Node.js", developedBy: "NyctoNid, Procohat Pvt. Ltd" })
})

// Server Configuration
app.listen(_PORT, () => {
    console.log(`App started and Listening on port ${_PORT}`)
})

