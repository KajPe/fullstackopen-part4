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

// Who have written most blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  var authors = blogs.reduce(function(found, blog) {
    var idx = found.findIndex((b => b.author === blog.author))
    if (idx === -1) {
      // Initial value
      found.push( { author: blog.author, blogs: 1 } )
    } else {
      // Add-up for author
      found[idx].blogs += 1
    }
    return found
  }, [])
  // Sort by blogs
  authors.sort(function(a, b){
    return b.blogs - a.blogs
  })
  // And now the first one in the array has most blogs
  return authors[0]
}

// Who have written most likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  var authors = blogs.reduce(function(found, blog) {
    var idx = found.findIndex((b => b.author === blog.author))
    if (idx === -1) {
      // Initial value
      found.push( { author: blog.author, likes: blog.likes } )
    } else {
      // Add-up for author
      found[idx].likes += blog.likes
    }
    return found
  }, [])
  // Sort by likes
  authors.sort(function(a, b){
    return b.likes - a.likes
  })
  // And now the first one in the array has most likes
  return authors[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
