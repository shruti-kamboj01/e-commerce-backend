const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.body.token || req.header("Authorization").replace("Bearer ", "");
    // console.log("token: ", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      console.log("decode", decode);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//user middleware
exports.isUser = async (req, res, next) => {
  try {
    console.log(req.user.roles);
    if (req.user.accountType !== "User") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Student only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, Please try again",
    });
  }
};

//Admin middleware
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.roles !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, Please try again",
    });
  }
};
