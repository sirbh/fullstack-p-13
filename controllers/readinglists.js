const router = require('express').Router()
const { Op } = require('sequelize');
const { tokenExtractor } = require("../middlewares");

const { Blog } = require('../models')
const BlogUser = require('../models/blogUser')
const User = require('../models/user')

router.post('/', async (request, response) => {
    console.log("Red",request.body)
  const userId = request.body.userId
  const blogId = request.body.blogId
  const user = await User.findByPk(userId)
  const blog = await Blog.findByPk(blogId)

  if(user && blog){
    const join = await BlogUser.create({
        userId:userId,
        blogId:blogId
    })

    return response.send(join)
  }

  response.status(400).send("cannot be created")
})

router.put('/:id',tokenExtractor, async (request, response) => {
  
  const id = request.params.id
  const uId = request.decodedToken.id

  const user = await User.findByPk(req.decodedToken.id);
  if(user.disabled){
    res.sendStatus(400).send("not permited")
  }

  const join = await BlogUser.findOne({
    where:{
      [Op.and]:[
        {blogId:id},
        {userId:uId}
      ]
    }
  })

  if(join){
    join.read = request.body.read
    return response.sendStatus(204)
  }

  response.status(400).send("cannot be updated")
})


module.exports = router