const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.json(user)
})

router.get('/:id', async (req, res) => {
  const read = req.query.read;
  let where = {}
  if(read){
    where = {
      read
    }
  }
  const user = await User.findByPk(req.params.id,{
    include:[
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId']},
        through: {
          attributes: ['read','id'],
          where
        }
      },
    ]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
    const username = req.params.username
    const user = await User.findOne({
        where:{
            username:username
        }
    })
    if (user) {
      user.username = req.body.username
      await user.save()
      return res.json(user)
    } else {
      res.status(404).end()
    }
  })

module.exports = router