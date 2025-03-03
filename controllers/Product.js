const Auth = require("../models/Auth")
const Category = require("../models/Category");
const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    //get data
    const { productName, productDescription, price, categoryId} = req.body;
    //validation
    if (!productName || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    console.log(categoryId)
    const categoryDetails = await Category.findById(categoryId)
    if (!categoryDetails) {
        return res.status(404).json({
          success: false,
          message: "Category Details Not Found",
        });
      }
    //create entry in db
    const newProduct = await Product.create({
      productName: productName,
      productDescription: productDescription,
      price: price,
      category: categoryId
    });

    await Category.findByIdAndUpdate(
        categoryId,
        {$push: {product: newProduct._id}},
        {new:true}
    );
    
    //return response
    return res.status(200).json({
      success: true,
      messsage: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(403).json({
        success: false,
        message: "Product not found",
      });
    }

    const { productName,   productDescription, price} = req.body;
    // console.log("updates are", typeof(updates))
    if (productName) {
      product.productName = productName;
    } else if (productDescription) {
      product.productDescription = productDescription;
    } else if(price) {
        product.price = price
    }

    const updatedProduct =  await product.save();

    return res.json({
      success: true,
      message: "Product Details updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId, categoryId } = req.body;
    const product= await Product.findById(productId);
    if (!product) {
      return res.status(403).json({
        success: false,
        message: "Product not found",
      });
    }
    await Category.findByIdAndUpdate(
        categoryId,
        {$pull: {product: productId}},
        {new: true}
    )
    await Product.findByIdAndDelete(productId);

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// showAllCategories
exports.showAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    //  console.log("printing categories",allCategories);
    res.status(200).json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//single Product
exports.showSingleProduct = async (req,res) => {
    try{
        const {productId} = req.body;
        console.log(productId)
        const productDetails = await Product.findById(productId)
        res.status(200).json({
            success: true,
            data: productDetails,
          });

    }catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
    }
}