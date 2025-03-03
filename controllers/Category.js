const Category = require("../models/Category");
const Product = require("../models/Product");

//add category
exports.createCategory = async (req, res) => {
  try {
    //get data
    const { name, description } = req.body;
    //validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //create entry in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    //  console.log(CategoryDetails);
    //return response
    return res.status(200).json({
      success: true,
      messsage: "Category created successfully",
      categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

//update Category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(403).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name, description } = req.body;
    if (name) {
      category.name = name;
    } else if (description) {
      category.description = description;
    }

    const updatedCategory = await category.save();
    // console.log(updatedCategory)
    return res.json({
      success: true,
      message: "Category updated successfully",
      updatedCategory,
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

//delete Category
exports.deletCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(403).json({
        success: false,
        message: "Category not found",
      });
    }
    // TODO: if category deleted then products of that category should also be deleted
    await Product.deleteMany({category: categoryId});
    await Category.findByIdAndDelete(categoryId);

    return res.json({
      success: true,
      message: "Category deleted successfully",
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
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    //  console.log("printing categories",allCategories);
    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
