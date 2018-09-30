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
    if (request.body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (request.body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }
    const newblog = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: (request.body.likes ? request.body.likes : 0)
    }
    const blog = new Blog(newblog)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    response.status(500).send({ error: 'Unable to save blog' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    if (request.body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (request.body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }

    const blog = {
      title: request.body.title,
      author: (request.body.author ? request.body.author: 'N/A'),
      url: request.body.url,
      likes: (request.body.likes ? request.body.likes : 0)
    }
    const blogUpdated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )
    response.status(200).json(blogUpdated)
  } catch (exception) {
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter