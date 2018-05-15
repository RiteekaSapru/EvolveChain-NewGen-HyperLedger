//const User = require('../models/users');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');

CheckUniqueEmail = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        return res.status(status.BadRequest).json({ message: messages.already_email });
      }
      next();
    })
    .catch((err) =>{
        return res.status(status.InternalServerError).json({ message: messages.error});
    });
};

module.exports = CheckUniqueEmail;

