
// --- Tests ---

describe('list helpers', () => {
  const listHelper = require('../utils/list_helper')
  const blog_data = require('./blog_data')                // Load blog data

  // Dummy
  test('dummy is called', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

  // Total likes
  describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(blog_data.listWithOneBlog)
      expect(result).toBe(5)
    })

    test('when list has six blogs', () => {
      const result = listHelper.totalLikes(blog_data.listWithSixBlogs)
      expect(result).toBe(36)
    })

    test('when list is empty', () => {
      const result = listHelper.totalLikes(blog_data.listWithNoBlog)
      expect(result).toBe(0)
    })
  })

  // Favorite blog
  describe('Favorite blog', () => {
    test('when list has only one blog', () => {
      const res =
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      }
      const result = listHelper.favoriteBlog(blog_data.listWithOneBlog)
      expect(result).toEqual(res)
    })

    test('when list has six blogs', () => {
      const res =
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      }
      const result = listHelper.favoriteBlog(blog_data.listWithSixBlogs)
      expect(result).toEqual(res)
    })

    test('when list is empty', () => {
      const result = listHelper.favoriteBlog(blog_data.listWithNoBlog)
      expect(result).toEqual({})
    })
  })

  // Most written blogs
  describe('Most written blogs', () => {
    test('when list has only one blog', () => {
      const res =
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1,
      }
      const result = listHelper.mostBlogs(blog_data.listWithOneBlog)
      expect(result).toEqual(res)
    })

    test('when list has six blogs', () => {
      const res =
      {
        author: 'Robert C. Martin',
        blogs: 3,
      }
      const result = listHelper.mostBlogs(blog_data.listWithSixBlogs)
      expect(result).toEqual(res)
    })

    test('when list is empty', () => {
      const result = listHelper.mostBlogs(blog_data.listWithNoBlog)
      expect(result).toEqual({})
    })
  })

  // Most liked blogs
  describe('Most liked blogs', () => {
    test('when list has only one blog', () => {
      const res =
      {
        author: 'Edsger W. Dijkstra',
        likes: 5,
      }
      const result = listHelper.mostLikes(blog_data.listWithOneBlog)
      expect(result).toEqual(res)
    })

    test('when list has six blogs', () => {
      const res =
      {
        author: 'Edsger W. Dijkstra',
        likes: 17,
      }
      const result = listHelper.mostLikes(blog_data.listWithSixBlogs)
      expect(result).toEqual(res)
    })

    test('when list is empty', () => {
      const result = listHelper.mostLikes(blog_data.listWithNoBlog)
      expect(result).toEqual({})
    })
  })
})