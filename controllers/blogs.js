const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(Blog.format))
    })
    .catch(err => {
      console.log(err)
    })
})

blogsRouter.post('/', (request, response) => {

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
      return Blog.format(blog)
    })
    .then(formattedBlog => {
      response.status(201).json(formattedBlog)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = blogsRouter