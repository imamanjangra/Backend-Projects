// import {User} from "../models/user.model.js";
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { options } from "../constant.js";
import bcrypt from "bcryptjs";
// import { CreateUser } from "../../../../URL shortener/backend/src/controllers/user.controller.js";

export const generateAccessTokenAndRefreshToken = async (id) => {
  const user = await User.findById(id);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, mobileno, address, email, password } = req.body;

  if (!firstname || !mobileno || !email || !password) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  const userExists = await User.findOne({
    $or: [{ email }, { mobileno }],
  });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    firstname,
    lastname,
    mobileno,
    address: {
      state: address?.state,
      city: address?.city,
      pincode: address?.pincode,
      street: address?.street,
    },
    email,
    password,
  });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "User registered successfully",
      user: createdUser,
    });
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password, mobileno } = req.body;
    if (!email && !mobileno) {
      throw new ApiError(400, "Email or Mobile number is required");
    }
    if (!password) {
      throw new ApiError(400, "Password is required");
    }
    const user = await User.findOne({ $or: [{ email }, { mobileno }] });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const PasswordCheck = await user.isPassworCorrect(password);
      // console.log(PasswordCheck);
    if (!PasswordCheck) {
      return res
        .status(400)
        .json({ message: "Password and Username is not correct :( " });
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
    const logginUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: logginUser,
            accessToken,
            refreshToken,
          },
          "User logged in Successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      },
    );

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({message :  "User Logout successfuly " });
  } catch (error) {
     throw new ApiError(500, error.message);
  }
});

export const changeCurrentPassword = asyncHandler(async (req , res) => {
    try {
        const {oldPassword , newPassword } = req.body;

        if(!(oldPassword || newPassword)){
            throw new ApiError(400 , "To update password Enter All fields ")
        }
        const user = await User.findOne(req.user._id);

        if(!user){
            throw new ApiError(400 , "user not found ")
        }

        const PasswordCheck = await user.isPassworCorrect(oldPassword);
        console.log(PasswordCheck);
    if (!PasswordCheck) {
      return res
        .status(400)
        .json({ message: "Password and Username is not correct :( " });
    }
        user.password = newPassword ;
         user.save({ validateBeforeSave: false });
        return res.status(200).json({message : "password update succfully "})
    } catch (error) {
        return res.status(500).json({message : "internal server error " , error : error.message , stack : error.stack})
    }
})


export const getuserData = asyncHandler(async (req , res) => {
     return res
    .status(200)
    .json({ message: "Fetch user data successfully", user: req.user });
})


export const updateUserInfo = asyncHandler(async (req , res) => {
    try {
    const { firstname, lastname, mobileno, email } = req.body;

    if (!firstname && !lastname && !email && !mobileno ) {
      return res.status(401).json({ message: "Enter data for update " });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          firstname,
          lastname,
          email,
          mobileno,
        },
      },
      {
        new: true,
      },
    ).select("-password");

    return res.status(200).json({message : "user information is updates succfully " , user})
  } catch (error) {
          return res.status(500).json({message : "internal server error " , error : error.message , stack : error.stack})

  }
})



export const refreshAccessToken = asyncHandler(async (req  , res) => {
     const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "unauthorized request" });
  }

  try {
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(400).json({ message: "unauthorized request " });
    }
    if (user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({ message: "Token is exipired or use" });
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);


    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "Refresh Token is updated" }, accessToken, refreshToken);
  } catch (error) {
        return res.status(500).json({message : "internal server error " , error : error.message , stack : error.stack})
  }
})