const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");

exports.userRegister = async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;
     // console.log(name);
    //validation
    if (!name || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check if user already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Username is already resgisted. Try a different username if you're new.",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create db entry
    const user = await Auth.create({
      name,
      email,
      roles:accountType,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check if user exists or not
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User is not registered, Please signup first",
      });
    }

    //generate JWT token, after comparing password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.roles,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      user.token = token;

      return res.status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Passsword is incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login Failure, Please try again later",
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { role } = req.params;

    // Check if the role is 'admin'
    if (role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // Find user in the database
    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    
    // Check if the user is actually an admin
    if (user.roles !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not an admin account.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Generate JWT token
    const payload = {
      email: user.email,
      roles: user.roles,
      id: user._id,
      
    };
     
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      token,
      user,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    return res.status(500).json({
      success: false,
      message: "Login failure, please try again later",
    });
  }
};