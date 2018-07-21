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

const formatBlog = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(formatBlog))
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/api/blogs', (request, response) => {

  if (request.body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (request.body.author === undefined) {
    return response.status(400).json({ error: 'author missing' })
  }
  if (request.body.url === undefined) {
    return response.status(400).json({ error: 'url missing' })
  }
  if (request.body.likes === undefined) {
    return response.status(400).json({ error: 'likes missing' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  })

  blog
    .save()
    .then(blog => {
      return formatBlog(blog)
    })
    .then(formattedBlog => {
      response.status(201).json(formattedBlog)
    })
    .catch(err => {
      console.log(err)
    })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
