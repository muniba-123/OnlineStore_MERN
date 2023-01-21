import asyncHandler from "express-async-handler";
import Order from "../models/order-model.js";
import nodemailer from "nodemailer";
import User from "../models/user-model.js";

// @description     Create new order
// @route           POST /api/orders
// @access          Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPRice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPRice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    sendEmailToAdmin(createdOrder);
    res.status(201).json(createdOrder);
  }
});

// @description     Get order by Id
// @route           GET /api/orders/:id
// @access          Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @description     Update order to paid
// @route           PUT /api/orders/:id/pay
// @access          Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.created,
      payment_method: req.body.payment_method,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @description     Update order to delivered
// @route           PUT /api/orders/:id/changeStatus
// @access          Private/Admin
// const updateOrderToDelivered = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isDelivered = true;
//     order.deliveredAt = Date.now();

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });
const sendEmailToAdmin=async (order)=>{
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    });
    const admin=await User.findOne({isAdmin:true});
    const mailOptions = {
      from: process.env.EMAIL,
      to: admin.email,
      subject: "New Order Received",
      text: `There is a new order received in your app.\n
      For further details visit the website.
      `,
    };
    smtpTransport.sendMail(mailOptions, async function (err, info) {})
}
const sendEmailToUser=async (order)=>{
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    });
    const user=await User.findById(order.user);
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Order status",
      text: `It is to inform you that the status of your order with tracking Id ${order._id} 
      has been changed to ${order.orderStatus}.\n
      For further details visit the website.
      `,
    };
    smtpTransport.sendMail(mailOptions, async function (err, info) {})
}
// @description     Update order status
// @route           PUT /api/orders/:id/deliver
// @access          Private/Admin
const changeOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.orderStatus = req.body.status;
    const updatedOrder = await order.save();
    sendEmailToUser(order);
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @description     Get logged user orders
// @route           PUT /api/orders/myorders
// @access          Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @description     Get all orders
// @route           GET /api/orders/
// @access          Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  // updateOrderToDelivered,
  changeOrderStatus
};
