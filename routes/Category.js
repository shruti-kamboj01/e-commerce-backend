const express = require("express")
const Auth = require("../models/Auth")
const { isAdmin, auth } = require("../middleware/auth")
const { createCategory, showAllCategories, deletCategory, updateCategory } = require("../controllers/Category")
const router = express.Router()

//Admin Apis
router.post('/addCategory', auth, isAdmin, createCategory)
router.put('/updateCategory', auth, isAdmin, updateCategory)
router.post('/deleteCategory', auth, isAdmin, deletCategory)
router.get('/allCategory', auth, isAdmin, showAllCategories)

module.exports = router