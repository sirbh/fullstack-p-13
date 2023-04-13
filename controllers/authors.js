const router = require("express").Router();
const { Blog } = require("../models");
const { fn,col } = require("sequelize");


router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      [fn("count",col("url")),'articles'],
      [fn("sum",col("likes")),'likes'],
      'author'
    ],
    group: ["author"],
    order:[["likes","DESC"]]
  });
  res.send(authors)
});

module.exports = router;
