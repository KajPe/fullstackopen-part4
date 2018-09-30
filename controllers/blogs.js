const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    if (blogs) {
      response.json(blogs)
    } else {
      // blogs is undefined, throw an error
      throw 0
    }
  } catch (exception) {
    response.status(500).send({ error: 'Unable to get blogs' })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    response.status(500).send({ error: 'Unable to save blog' })
  }
})

module.exports = blogsRouter