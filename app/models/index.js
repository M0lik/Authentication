import mongoose from 'mongoose';
import role from "./role.model";
import user from './user.model';

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = user;
db.role = role;
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;