const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const {contactsRouter, authRouter} = require('./routes')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path: './envs/dev.env'});
const {MONGO_URL, MONGO_SCHEMA} = process.env;

mongoose.connect(MONGO_URL + MONGO_SCHEMA)
  .then( () => console.log('Database connection successful'))
  .catch((err) => {
    console.log('ERROR MONGO!!', err.message);
    process.exit(1);
  })

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'


app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter);
app.use('/api/users', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(err.status ?? 500).json({ message: err.message })
})

module.exports = app
