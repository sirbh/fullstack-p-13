var jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const Auth = require("../models/auth");

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get("Authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
      try {
        const authRecord = await Auth.findOne({
          where:{
            token:authorization.substring(7)
          }
        })
        if(!authRecord){
          return res.status(401).json({ error: "token invalid" });
        }
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      } catch {
        return res.status(401).json({ error: "token invalid" });
      }
    } else {
      return res.status(401).json({ error: "token missing" });
    }
    next();
  };

module.exports = {tokenExtractor}