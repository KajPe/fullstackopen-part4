const usersRouter = require('express').Router()
const User = require('../models/user')
const bcryptjs = require('bcryptjs')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { likes: 1, author: 1, title: 1, url: 1 })

    if (users) {
      response.json(users.map(User.format))
    } else {
      // users is undefined, throw an error
      throw 0
    }
  } catch (exception) {
    response.status(500).send({ error: 'Unable to get users' })
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    if (request.body.password.length < 3) {
      return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const existingUser = await User.find({ username: request.body.username })
    if (existingUser.length > 0) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(request.body.password, saltRounds)

    const newUser = {
      username: request.body.username,
      name: request.body.name,
      passwordHash: passwordHash,
      adult: (request.body.adult ? request.body.adult : true),
      blogs: []
    }
    const user = new User(newUser)
    const savedUser = await user.save()
    response.status(201).json(User.format(savedUser))
  } catch (exception) {
    response.status(500).send({ error: 'Unable to save user' })
  }
})

module.exports = usersRouter