const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (blogWithMaxLikes, blog) => {
    return (blogWithMaxLikes.likes > blog.likes) ? blogWithMaxLikes : blog
  }
  return blogs.length === 0 ? null : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  const countAuthors = (authors, blog) => {
    authors[blog.author] ? authors[blog.author]++ : authors[blog.author] = 1
    return authors
  }

  const authors = blogs.reduce(countAuthors, {})
  const authorWithMostBlogs = Object.keys(authors).reduce((
    (authorWithMaxBlogs, author) =>
      authors[authorWithMaxBlogs] > authors[author] ? authorWithMaxBlogs : author
  ), authors[0])

  return {
    author: authorWithMostBlogs,
    blogs: authors[authorWithMostBlogs]
  }
}

const mostLikes = (blogs) => {
  const countLikes = (likes, blog) => {
    likes[blog.author] ? likes[blog.author] += blog.likes : likes[blog.author] = blog.likes
    return likes
  }

  const likes = blogs.reduce(countLikes, {})
  const authorWithMostLikes = Object.keys(likes).reduce((
    (authorWithMostLikes, author) =>
      likes[authorWithMostLikes] > likes[author] ? authorWithMostLikes : author
  ), likes[0])

  return {
    author: authorWithMostLikes,
    likes: likes[authorWithMostLikes]
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}

