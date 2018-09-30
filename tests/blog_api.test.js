
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

  describe('Delete blogs', () => {
    test('Delete a blog', async () => {
      // Add a blog which should be deleted
      const blogsInDatabaseBefore = await helper.blogsInDatabase()

      // The blog shouldn't be there
      const blogsBefore = blogsInDatabaseBefore.map(blog => blog.title)
      expect(blogsBefore).not.toContain('=== BLOG TO BE DELETED ===')

      // Add the to-be-deleted blog
      const newBlog = {
        title: '=== BLOG TO BE DELETED ===',
        author: 'Mr New Blog',
        url: 'https://www.google.com/',
        likes: 34
      }
      const respPost = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsInDatabaseAfter = await helper.blogsInDatabase()
      expect(blogsInDatabaseAfter.length).toBe(blogsInDatabaseBefore.length + 1)

      // The new blog should be in the database
      const blogsAfter = blogsInDatabaseAfter.map(blog => blog.title)
      expect(blogsAfter).toContain('=== BLOG TO BE DELETED ===')

      await api
        .delete(`/api/blogs/${respPost.body._id}`)
        .expect(204)

      // Count of blogs should be minus 1
      const blogsInDatabaseAfterDelete = await helper.blogsInDatabase()
      expect(blogsInDatabaseAfterDelete.length).toBe(blogsInDatabaseAfter.length - 1)

      // And the blog should not be there anymore
      const blogsAfterDelete = blogsInDatabaseAfterDelete.map(blog => blog.title)
      expect(blogsAfterDelete).not.toContain('=== BLOG TO BE DELETED ===')
    })
  })

  describe('Update blogs', () => {
    test('Update a blog', async () => {
      const blogsInDatabaseBefore = await helper.blogsInDatabase()

      // Get all blogs
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // Update first blog
      const UpdateBlog = {
        title: 'BLOG UPDATED',
        author: 'Mr Nobody',
        url: 'https://www.google.com/',
        likes: 312
      }
      const respPut = await api
        .put(`/api/blogs/${response.body[0]._id}`)
        .send(UpdateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsInDatabaseAfter = await helper.blogsInDatabase()
      expect(blogsInDatabaseAfter.length).toBe(blogsInDatabaseBefore.length)

      // Check the API returned updated blog
      expect(helper.blogFormat(respPut.body)).toEqual(UpdateBlog)
      // Check the database contains updated blog
      expect(blogsInDatabaseAfter[0]).toEqual(UpdateBlog)
    })
  })

  afterAll(() => {
    server.close()
  })
})