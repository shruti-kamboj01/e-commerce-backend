const express = require("express")
const { showAllProducts, showSingleProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/Product")
const { auth, isAdmin } = require("../middleware/auth")
const router = express.Router()


router.get('/allProducts', auth, showAllProducts)
router.get('/product',auth, showSingleProduct)

router.post('/createProduct', auth, isAdmin, createProduct)
router.put('/updateProduct', auth, isAdmin, updateProduct)
router.post('/deleteProduct', auth, isAdmin, deleteProduct)

module.exports = router