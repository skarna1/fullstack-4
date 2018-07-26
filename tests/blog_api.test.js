
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5b5a0d2db80cbb4ab9fdc7f1',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    _id: '5b5a0d2db80cbb4ab9fdc7f0',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('get blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body).toContainEqual(
      {
        id: '5b5a0d2db80cbb4ab9fdc7f0',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
      }
    )
  })
})

describe('add blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(response.body).toContainEqual(
      {
        id: expect.any(String),
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      })
  })

  test('if likes is not given, it is set to zero ', async () => {
    const newBlog = {
      title: 'Type wars2',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    const blogsAtBeginningOfTest = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(blogsAtBeginningOfTest.body.length + 1)
    expect(response.body).toContainEqual(
      {
        id: expect.any(String),
        title: 'Type wars2',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 0
      })
  })

  test('if title or url missing, 400 is returned ', async () => {
    const titleMissing = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }
    const urlMissing = {
      author: 'Robert C. Martin',
      title: 'Type wars'
    }
    const blogsAtBeginningOfTest = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(titleMissing)
      .expect(400,)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(urlMissing)
      .expect(400,)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(blogsAtBeginningOfTest.body.length)
  })
})
afterAll(() => {
  server.close()
})