const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
require('express-async-errors');
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const readingListsRouter = require('./controllers/readinglists');
const { ValidationError } = require('sequelize');

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/reading-lists', readingListsRouter)

app.use((error,req,res,next)=>{
  if(error instanceof ValidationError){
    return res.status(400).send(error.message)
  }
  console.log(error)
  res.status(400).send('something went wrong')
})

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()