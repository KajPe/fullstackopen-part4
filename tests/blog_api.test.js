
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

  describe('Get blogs', () => {
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
  })

  describe('Post blogs', () => {
    test('Post a new blog', async () => {
      // Get current blogs from database
      const respBefore = await api
        .get('/api/blogs')
      const blogcount1 = respBefore.body.length

      const newBlog = {
        title: 'Test a new blog',
        author: 'Mr New Blog',
        url: 'https://www.google.com/',
        likes: 23
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const respAfter = await api
        .get('/api/blogs')
      const blogcount2 = respAfter.body.length

      expect(blogcount2).toBe(blogcount1 + 1)
    })
  })

  afterAll(() => {
    server.close()
  })
})