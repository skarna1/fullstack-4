const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const router = require('./controllers/blogs')
const config = require('./utils/config')

mongoose.connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch(err => {
    console.log(err)
  })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.logger)
app.use('/api/blogs', router)
app.use(middleware.error)

const server = http.createServer(app)
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

app.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
