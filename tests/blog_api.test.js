
describe('Blog API Tests', () => {
  const supertest = require('supertest')
  const { app, server } = require('../index')
  const api = supertest(app)
  const Blog = require('../models/blog')
  const blog_data = require('./blog_data')                // Load blog data

  beforeAll(async () => {
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
  })

  test('Blogs returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
    expect(response.body.length).toBe(blog_data.listWithSixBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(contents).toContainEqual(blog_data.listWithSixBlogs[2].title)
  })

  afterAll(() => {
    server.close()
  })
})