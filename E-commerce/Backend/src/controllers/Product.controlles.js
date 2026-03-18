// import { Product } from "../models/product.model.js";
import {Product} from "../model/Product.model.js"
import { asyncHandler } from "../utils/async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {

  const { name, price, description , brandLink , discountPrice , category , brand , stock ,ratings , numReviews , soldCount  } = req.body;

  if (!name || !price  || !description || !category || !stock ) {
    return res.status(400).json({
      message: "All filed are required",
    });
  }

  // COVER IMAGE
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!coverImageLocalPath) {
    return res.status(400).json({
      message: "Cover image is required",
    });
  }

  const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImageUpload) {
    return res.status(500).json({
      message: "Cover image upload failed",
    });
  }

  // MULTIPLE IMAGES
  let productImages = [];

  if (req.files?.images) {

    for (const file of req.files.images) {

      const result = await uploadOnCloudinary(file.path);

      if (result) {
        productImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
  }

  const product = await Product.create({
    name,
    price,
    description,
    brandLink,
    discountPrice ,
    category,
    brand,
    stock,
    ratings,
    numReviews,
    soldCount,
    coverImage: coverImageUpload.secure_url,
    images: productImages,
  });

  return res.status(201).json({
    message: "Product created successfully",
    product,
  });
};

export const updateProduct = asyncHandler(async (req , res) => {
  // const product = req.params.id;

    const { name, price, description , brandLink , discountPrice , category , brand , stock   } = req.body;

      if(!name && !price && !description  && !brandLink && !discountPrice && !category && !brand && !stock) {
              return res.status(400).json({message : "Enter a data to update"});
          }

      const updateProductvalue = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set : {
            name ,
            price ,
            description,
            brandLink,
            discountPrice,
            category,
            brand,
            stock
          }
        },
        {
          new : true
        }
      )

      return res.status(200).json({message : "Product update succfuly" , updateProductvalue})


})

export const deleteProduct = asyncHandler(async (req , res) => {
  try {
    const product = await Product.findById(req.params.id);
     
         if(!product){
             return res.status(200).json({message : "Product is not entred !"});
         }
     
         if(req.user._id.toString() !== Product.userID.toString()){
             return res.status(400).json({message : " authorized user not found "});
         }
     
         product.deleteOne();
     
         return res.status(200).json({message : "address deleted succfully "})
       } catch (error) {
        return res.status(500).json({message : "somthing went wrong  "})
       }        
    
  }
)

export const getProductsByCategory = async (req, res) => {
  try {

    const { categoryId } = req.params;

    const products = await Product.find({
      category: categoryId
    }) 

    return res.status(200).json({
      message: "Products fetched successfully",
      products
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

