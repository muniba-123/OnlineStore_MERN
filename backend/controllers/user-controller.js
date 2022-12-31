import asyncHandler from "express-async-handler";
import generateToken from "../utils/generate-token.js";
import User from "../models/user-model.js";
import nodemailer from "nodemailer";
// @description     Auth user & get token
// @route           POST /api/users/login
// @access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password)) && user.isVerified) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });

  } 
  else if (user && (await user.matchPassword(password)) && !user.isVerified) {
	res.status(403);
    throw new Error("User not verified");
  }
  else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}
// @description     Register a new user
// @route           POST /api/users
// @access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
	throw new Error('User already exists');
  }
const code=generateRandomNumber();
const smtpTransport = nodemailer.createTransport({
	service: "gmail",
	auth: {
	  user: process.env.EMAIL,
	  pass: process.env.PASSWORD,
	},
  });
  console.log(process.env.PASSWORD)
  console.log(process.env.EMAIL)

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Email verification",
    text: "Your verification code is " + code,
  };
  smtpTransport.sendMail(mailOptions, async function (err, info) {
    if (err) {
      console.log(err);
    } else {
      const user = await User.create({
        name,
        email,
        password,
		code
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
		 
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    }
  });
});

const verifyCode = asyncHandler(async (req, res) => {
  const user = await User.findOne({email:req.body.email});
  if (user && user.code == req.body.code) {
    user.isVerified = true;
   await user.save();
    res.send(200);
  } else {
    res.status(400);
    throw new Error("Code is not valid.");
  }
});

// @description     Get user profile
// @route           GET /api/users/profile
// @access          Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
	res.json({
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
	});
} else {
	res.send(404);
	throw new Error('User not found');
}
});

// @description     Update user profile
// @route           PUT /api/users/profile
// @access          Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.send(404);
    throw new Error("User not found");
  }
});

// @description     Get all users
// @route           GET /api/users
// @access          Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @description     Delete user
// @route           DELETE /api/users/:id
// @access          Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @description     Get user by Id
// @route           GET /api/users/:id
// @access          Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @description     Update user
// @route           PUT /api/users/:id
// @access          Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin =
      req.body.isAdmin === undefined || req.body.isAdmin === null
        ? user.isAdmin
        : req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.send(404);
    throw new Error("User not found");
  }
});

// @description     Add new Favorite Product
// @route           POST /api/users/:id/favorites
// @access          Private
const addFavoriteProduct = asyncHandler(async (req, res) => {
  const { productId, name, image, price, numReviews, rating } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    const favorite = {
      name,
      image,
      price,
      numReviews,
      rating,
      product: productId,
    };

    user.favorites.push(favorite);
    await user.save();
    res.status(201).json({
      favorites: user.favorites,
      message: "Product is added to favorites",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @description     Delete Favorite Product
// @route           DELETE /api/users/:id/favorites/:productId
// @access          Private
const removeFavoriteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const user = await User.findById(req.params.id);

  const isExists = user.favorites.some(
    (x) => x.product.toString() == productId.toString()
  );

  if (isExists) {
    user.favorites = user.favorites.filter(
      (favorite) => favorite.product.toString() !== productId.toString()
    );
    await user.save();
    res.status(202).json({
      message: "Product is removed from favorites",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @description     Get Favorite Products
// @route           GET /api/users/:id/favorites
// @access          Private
const getFavoriteProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.status(200).json({ favorites: user.favorites });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  verifyCode,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addFavoriteProduct,
  removeFavoriteProduct,
  getFavoriteProducts,
};
