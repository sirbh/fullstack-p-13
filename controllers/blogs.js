const router = require("express").Router();

const { Blog, User } = require("../models");
const { Op,fn,col } = require("sequelize");
const { tokenExtractor } = require("../middlewares");



router.get("/authors", async (req, res) => {
  console.log('I am here')
  const authors = await Blog.findAll({
    attributes: [
      [fn("count",col("url")),'articles'],
      [fn("sum",col("likes")),'likes'],
      'author'
    ],
    group: ["author"],
  });
  console.log(JSON.stringify(authors))
  res.send(authors)
});

router.get("/", async (req, res) => {
  let where = undefined;
  const query = req.query.search;
  if (query) {
    console.log("query is", query);
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${query}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${query}%`,
          },
        },
      ],
    };
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    order: [["likes", "DESC"]],
    where: where,
  });
  res.json(blogs);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if(user.disabled){
    res.sendStatus(400).send("not permited")
  }
  const newBlog = req.body;
  const blog = await Blog.create({ ...newBlog, userId: user.id });
  res.json(blog);
});

router.delete("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if(user.disabled){
    res.sendStatus(400).send("not permited")
  }
  const blog = await Blog.findByPk(req.params.id);
  if (blog && user) {
    if (blog.userId === user.id) {
      await blog.destroy();
      return res.status(204).end();
    }
    return res.status(400).send("cannot be deleted");
  }
  res.status(204).end();
});

router.put("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
