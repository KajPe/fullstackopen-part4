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

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter