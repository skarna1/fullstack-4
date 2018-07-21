const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog

app.use(cors())
app.use(bodyParser.json())

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to database', process.env.MONGODB_URI)
  })
  .catch(err => {
    console.log(err)
  })

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(err => {
      console.log(err)
    })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
