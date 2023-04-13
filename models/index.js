const Blog = require('./blog')
const BlogUser = require('./blogUser')
const User = require('./user')
const Auth = require('./auth')


User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog,{through:BlogUser,as:'readings'})
Blog.belongsToMany(User,{through:BlogUser,as:'readingLists'})

module.exports = {
  Blog, User
}