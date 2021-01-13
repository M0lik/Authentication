import db from "../models";
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  try {
    if (await User.findOne({ username: req.body.username }).exec())
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    if (await User.findOne({ email: req.body.email }).exec())
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    next();
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles)
    for (let i = 0; i < req.body.roles.length; i++)
      if (!ROLES.includes(req.body.roles[i]))
        return res.status(400).send({ message: `Failed! Role ${req.body.roles[i]} does not exist!` });
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

export default verifySignUp;