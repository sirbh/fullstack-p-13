const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Auth = require('../models/auth')
const { tokenExtractor } = require('../middlewares')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })
  
  if(user.disabled){
    response.sendStatus(400).send('not permitted')
  }

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const authDetails = await Auth.findOne({
    where:{
      userId:user.id
    }
  })

  if(authDetails){
    return response
    .status(200)
    .send({ token:authDetails.token, username: user.username, name: user.name })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await Auth.create({
    token:token,
    userId:user.id
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

router.delete('/logout',tokenExtractor, async (req,res)=>{
  const uId = request.decodedToken.id

  await Auth.destroy({
    where:{
      userId:uId
    }
  })

  res.send(204)
})

module.exports = router