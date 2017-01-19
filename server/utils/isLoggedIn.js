/**
 * Created by bogdan on 17.01.17.
 */
'use strict';
let isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Авторизируйтесь");
};

module.exports = isLoggedIn;