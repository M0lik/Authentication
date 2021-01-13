import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models";

const User = db.user;
const Role = db.role;

const verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(403).send({ message: "No token provided!" });

    try {
        const decoded = await jwt.verify(token, config.secret);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).send({ message: "Unauthorized!" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        const roles = await Role.find({ _id: { $in: user.roles } });
        for (let i = 0; i < roles.length; i++)
            if (roles[i].name === "admin") {
                return next();
            }
        return res.status(403).send({ message: "Require Admin Role!" });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

export const isModerator = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        const roles = await Role.find({ _id: { $in: user.roles } });

        for (let i = 0; i < roles.length; i++)
            if (roles[i].name === "moderator")
                return next();

        return res.status(403).send({ message: "Require Moderator Role!" });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};

export default authJwt;