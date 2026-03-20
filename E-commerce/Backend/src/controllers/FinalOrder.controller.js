import { Address } from "../model/address.model.js";
import { FinalCart } from "../model/FinalOrder.model.js";
import { Product } from "../model/Product.model.js";
import { Order } from "../model/shoppingCart.model.js";

export const createFinalOrder = async (req, res) => {
  try {
    const { addressId } = req.body;

    const cart = await Order.findOne({ user: req.user._id });

    if (!cart || cart.orderItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(400).json({ message: "Address not found" });
    }

    for (let item of cart.orderItems) {
      const product = await Product.findById(item.product);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.name} is out of stock`,
        });
      }
    }

    for (let item of cart.orderItems) {
      const product = await Product.findById(item.product);

      product.stock -= item.quantity;
      await product.save();
    }

    const finalOrder = await FinalCart.create({
      user: req.user._id,
      orderItems: cart.orderItems,
      totalPrice: cart.totalPrice,
      shippingAddress: {
        state: address.state,
        city: address.city,
        pincode: address.pincode,
        street: address.street,
        addressLine: address.addressLine,
        landmark: address.landmark,
        addressType: address.addressType,
      },
      isPaid: false,
    });

    cart.orderItems = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: finalOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
