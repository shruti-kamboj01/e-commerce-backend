const express = require("express")
const { userRegister, adminLogin, userLogin } = require("../controllers/auth")
const router = express.Router()

router.post("/signup", userRegister)
router.post("/:role/login", adminLogin)
router.post("/user/login", userLogin)