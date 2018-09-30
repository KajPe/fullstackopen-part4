
describe('Blog API Tests', () => {
  const supertest = require('supertest')
  const { app, server } = require('../index')
  const api = supertest(app)
  const helper = require('./test_helper')

  beforeAll(async () => {
    // Remove all blogs from database and write predefined blogs
    await helper.populateDatabaseWithSixBlogs()
  })

  describe('Get blogs', () => {
    test('All blogs returned as json', async () => {
      const blogsInDatabase  = await helper.blogsInDatabase()
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(blogsInDatabase.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const blogsInDatabase  = await helper.blogsInDatabase()

      const response = await api
        .get('/api/blogs')

      const contents = response.body.map(r => r.title)
      expect(contents).toContainEqual(blogsInDatabase[2].title)
    })
  })

  describe('Post blogs', () => {
    test('Post a new blog', async () => {
      // Get current blogs from database
      const blogsInDatabaseBefore = await helper.blogsInDatabase()

      const newBlog = {
        title: 'Test a new blog',
        author: 'Mr New Blog',
        url: 'https://www.google.com/',
        likes: 23
      }
      const theBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsInDatabaseAfter = await helper.blogsInDatabase()

      expect(blogsInDatabaseAfter.length).toBe(blogsInDatabaseBefore.length + 1)
      expect(helper.blogFormat(theBlog.body)).toEqual(newBlog)
    })

    test('Post a new blog (with likes)', async () => {
      const blogsInDatabaseBefore = await helper.blogsInDatabase()

      const newBlog = {
        title: 'No likes',
        author: 'Mr New Blog',
        url: 'https://www.google.com/',
        likes: 62
      }
      const respPost = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsInDatabaseAfter = await helper.blogsInDatabase()

      expect(blogsInDatabaseAfter.length).toBe(blogsInDatabaseBefore.length + 1)
      expect(respPost.body.likes).toBe(62)
    })

    test('Post a new blog (no likes)', async () => {
      const blogsInDatabaseBefore = await helper.blogsInDatabase()

      const newBlog = {
        title: 'No likes',
        author: 'Mr New Blog',
        url: 'https://www.google.com/'
      }
      const respPost = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsInDatabaseAfter = await helper.blogsInDatabase()

      expect(blogsInDatabaseAfter.length).toBe(blogsInDatabaseBefore.length + 1)
      expect(respPost.body.likes).toBe(0)
    })

    test('Post a new blog (missing title)', async () => {
      const blogsInDatabaseBefore = await helper.blogsInDatabase()

      const newBlog = {
        author: 'Mr New Blog',
        url: 'https://www.google.com/'
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsInDatabaseAfter = await helper.blogsInDatabase()

      expect(blogsInDatabaseAfter.length).toBe(blogsInDatabaseBefore.length)
    })

    test('Post a new blog (missing url)', async () => {
      const blogsInDatabaseBefore = await helper.blogsInDatabase()

      const newBlog = {
        title: 'Missing url',
        author: 'Mr New Blog'
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsInDatabaseAfter = await helper.blogsInDatabase()

      expect(blogsInDatabaseAfter.length).toBe(blogsInDatabaseBefore.length)
    })
  })

  afterAll(() => {
    server.close()
  })
})