// Dummy function ..
const dummy = (blogs) => {

  // Always return 1 ..
  return 1
}

// Calculate total likes
const totalLikes = (blogs) => {
  return blogs.reduce(function(sum, blog) {
    return sum + blog.likes
  }, 0)
}

// Find favorite blog
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  var a = blogs.reduce(function(found, blog) {
    if ((found[0] === undefined) || (blog.likes > found[0].likes)) {
      found[0] = blog
    }
    return found
  }, [])
  return {
    title: a[0].title,
    author: a[0].author,
    likes: a[0].likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
