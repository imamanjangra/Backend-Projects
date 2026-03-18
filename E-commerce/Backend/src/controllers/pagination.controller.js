import { Product } from "../model/Product.model.js"

export const getProducts = async (req, res) => {

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const skip = (page - 1) * limit

  const products = await Product.find()
    .skip(skip)
    .limit(limit)

  const totalProducts = await Product.countDocuments()

  res.status(200).json({
    page,
    limit,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    products
  })
}