'use strict';
const express = require('express');
let router = express.Router();

const Config = require('../config');
const DB = require('../db');
const DBUser = DB.User;

const RongSDK = require('rongcloud-sdk')({
  appkey: Config.appkey,
  secret: Config.secret
});
const User = RongSDK.User;

const utils = require('../utils');

router.post('/register', (req, res) => {
  let params = req.params || {};
  let user = req.body || {};
  let phone = user.phone;

  DBUser.find(user).then(_user => {
    if (_user) {
      return res.json(_user);
    }
    DBUser.create(user).then(user => {
      _user = utils.rename(user, {nickname: 'name', portraitUri: 'portrait'});
      User.register(_user).then(_user => {
        let token = _user.token;
        utils.extend(user, {token});
        // 注册用户成功后混存用户信息
        DBUser.Cache.set(phone, user);
        res.json({
          code: 200
        });
      }, error => {
        res.json({
          code: error
        });
      });
    });
  });
});

router.post('/login', (req, res) => {
  let params = req.params || {};
  let user = req.body || {};

  DBUser.find(user).then(_user => {
    if (!_user) {
      return res.json({
        code: 1000,
        msg: 'unknow user'
      });
    }
    if (!utils.isPropEqual(user, _user, 'password')) {
      return res.json({
        code: 1001,
        msg: 'username and password not match'
      });
    }
    delete _user.password;
    return res.json(_user);
  });
});

module.exports = router;