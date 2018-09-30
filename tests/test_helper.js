const Blog = require('../models/blog')
const blog_data = require('./blog_data')                // Load blog data

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
    }
    return new Blog(b)
  })
  const promiseArr = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArr)
}

const blogFormat = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

const blogsInDatabase = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blogFormat)
}

module.exports = {
  clearDatabase,
  populateDatabaseWithOneBlog,
  populateDatabaseWithSixBlogs,
  blogsInDatabase,
  blogFormat
}