const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors');

connectToMongo();
const port = 5000
var app = express()
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json())


app.get('/', (req, res) => {
  res.send('Welcome to the inotebook API!')
})

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/notes'))


app.listen(port, () => {
  console.log(`inotebook app listening on port http://localhost:${port}`)
})
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


module.exports = app;