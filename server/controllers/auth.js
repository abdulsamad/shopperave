const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/user");

exports.signup = (req, res) => {
  const user = new User(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg,
    });
  }

  user.save((err, dbUser) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }

    return res.json({
      name: dbUser.name,
      email: dbUser.email,
      id: dbUser._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User email does not exists",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        err: "Email and password do not match",
      });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send response to front end
    const { _id, name, role } = user;

    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");

  return res.json({
    message: "User signout successfully",
  });
};

// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile
    && req.auth
    && req.profile._id.toString() === req.auth._id.toString();

  // ! Payment not working with this check
  if (!checker) {
    return res.status(403).json({
      err: "ACCESS DENIED",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      err: "You are not Admin, Access denied. ????",
    });
  }

  next();
};
