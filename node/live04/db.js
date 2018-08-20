'use strict';

let utils = require('./utils');
let Cache = utils.Cache;

let UserCache = new Cache();

let User = { };

User.find = (user) => {
  let phone = user.phone;
  user = UserCache.get(phone);
  return Promise.resolve(user);
};

let genUId = () => {
  // return (+new Date).toString(16);
  return '1002'
};

User.create = (user) => {
  user.id = genUId();
  return Promise.resolve(user);
};

User.Cache = UserCache;

module.exports = {
  User
};