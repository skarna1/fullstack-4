const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs.map(Blog.format))
  }
  catch (exception) {
    console.log(exception)
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    if (request.body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (request.body.author === undefined) {
      return response.status(400).json({ error: 'author missing' })
    }
    if (request.body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes === undefined ? 0 : request.body.likes
    })

    await blog.save()
    response.status(201).json(Blog.format(blog))
  }
  catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = blogsRouter