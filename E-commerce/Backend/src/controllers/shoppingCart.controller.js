import { Order } from "../model/shoppingCart.model.js";
import { Product } from "../model/Product.model.js";

// export const createOrder = async (req, res) => {
//   try {

//     const { orderItems, shippingAddress, paymentMethod } = req.body;

//     if (!orderItems || orderItems.length === 0) {
//       return res.status(400).json({
//         message: "No items in order"
//       });
//     }

//     let items = [];
//     let totalPrice = 0;

   
//     for (const item of orderItems) {

//       const product = await Product.findById(item.product);

//       if (!product) {
//         return res.status(404).json({
//           message: "Product not found"
//         });
//       }

//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           message: "Not enough stock"
//         });
//       }

//       const orderItem = {
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         quantity: item.quantity,
//         image: product.coverImage
//       };

//       items.push(orderItem);


//       totalPrice += product.price * item.quantity;

//       product.stock -= item.quantity;
//       await product.save();
//     }

//     const order = await Order.create({
//       user: req.user._id,
//       orderItems: items,
//       shippingAddress,
//       paymentMethod,
//       totalPrice
//     });


//     return res.status(201).json({
//       message: "Order created successfully",
//       order
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };


export const shoppingCart = async (req , res) => {
try {
  
    const product = await Product.findById(req.params.id);
    const {quantity} = req.body;
    if(!product){
      return res.status(400).json({message : "Product not found "});
    }
  
    let cart = await Order.findOne({user : req.user.id});
  
    if(!cart){
      cart = await Order.create({
        user : req.user._id,
        orderItems :[
         {
          product : req.params.id,
          quantity : quantity
         }
        ]
      })
    }
    else{
       const itemIndex = cart.orderItems.findIndex(
          item => item.product.toString() === req.params.id
        );
  
         if (itemIndex > -1) {
          cart.orderItems[itemIndex].quantity += quantity;
        } else {
          cart.orderItems.push({
            product: req.params.id,
            quantity : quantity
          });
        }
        await cart.save();
  
        
      }
      res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart
    });
  
  
} catch (error) {
  res.status(500).json({
      message: error.message
    });
}

}
