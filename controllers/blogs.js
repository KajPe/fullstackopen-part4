const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })

    if (blogs) {
      response.json(blogs.map(Blog.format))
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
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (request.body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (request.body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }

    // Get user based on token
    let user = await User.findById(decodedToken.id)

    const newblog = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: (request.body.likes ? request.body.likes : 0),
      user: user._id
    }

    const blog = new Blog(newblog)
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(Blog.format(savedBlog))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      response.status(500).send({ error: 'Unable to save blog' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    // Get user based on token
    const user = await User.findById(decodedToken.id)

    // Get blog
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'now allowed to remove blog' })
    }
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      response.status(400).send({ error: 'malformatted id' })
    }
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