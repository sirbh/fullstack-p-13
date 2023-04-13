require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull:false
  },
  title: {
    type: DataTypes.STRING,
    allowNull:false
  },
  likes:{
    type: DataTypes.INTEGER,
    allowNull:false,
    defaultValue:0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()

app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs',async (req,res) => {
  const newBlog = req.body
  try {
    const blog = await Blog.create(newBlog)
    res.json(blog)
  }
  catch(e){
    res.send(400)
  }
})

app.delete('/api/blogs/:id',async (req,res)=>{
  const id = req.params.id
  const data = await Blog.destroy({where:{
    id:id
  }})
  res.send(200)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// const main = async () => {
//   try {
//     await sequelize.authenticate()
//     const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
//     blogs.forEach(blog=>{
//       console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
//     })
//     sequelize.close()
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }
// }

// main()