const Blog = require('../models/blog')
const User = require('../models/user')
const blog_data = require('./blog_data')                // Load blog data

const clearUserDatabase = async () => {
  await User.remove({})
}

const usersInDatabase = async () => {
  const users = await User.find({})
  return users
}

const userInDatabase = async (id) => {
  const user = await User.findById(id)
  return user
}
const clearDatabase = async () => {
  await Blog.remove({})
}

const populateDatabaseWithOneBlog = async () => {
  await Blog.remove({})

  const blogObjects = blog_data.listWithOneBlog.map(blog => {
    let b =
    {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user
    }
    return new Blog(b)
  })
  const promiseArr = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArr)
}

const populateDatabaseWithSixBlogs = async () => {
  // Remove all blogs from database and write predefined blogs
  await Blog.remove({})

  const blogObjects = blog_data.listWithSixBlogs.map(blog => {
    let b =
    {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user
    }
    return new Blog(b)
  })
  const promiseArr = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArr)
}

const blogsInDatabase = async () => {
  const blogs = await Blog.find({})
  return blogs
}

module.exports = {
  clearDatabase,
  populateDatabaseWithOneBlog,
  populateDatabaseWithSixBlogs,
  blogsInDatabase,
  clearUserDatabase,
  usersInDatabase,
  userInDatabase
}