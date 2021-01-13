import config from '../config/auth.config';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from '../models';

const User = db.user;
const Role = db.role;

export const signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      user.roles = roles.map(role => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      user.roles = [role._id];
    }

    await user.save();
    return res.send({ message: "User was registered successfully!" });
  }
  catch (err) {
    console.error('error :', err);
    return res.status(500).send({ message: err });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate("roles", "-__v")
      .exec();

    if (!user)
      return res.status(404).send({ message: "User Not found." });

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    var token = jwt.sign(
      { id: user.id },
      config.secret,
      { expiresIn: 86400 }
    );//24h

    var authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }

    return res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });

  } catch (err) {
    return res.status(500).send({ message: err });
  }
};