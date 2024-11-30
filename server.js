const cors = require('cors')
const morgan = require('morgan')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const papersRouter = require('./routers/papers')
require('dotenv').config();
const api = process.env.API_URL
const port = process.env.PORT || 8080

app.use(cors())
app.options('*', cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(`${api}/papers`, papersRouter);

mongoose.connect(process.env.CONNECTION_STRING).then(()=> console.log('Connected')).catch((e) => console.log(e.message))

app.listen(port, (req, res) => {
    console.log(`Server is running on http://localhost:${port}`);

})