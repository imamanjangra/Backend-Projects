  import { google } from "googleapis";
  import { User } from "../model/user.model.js";
  import jwt from "jsonwebtoken";

  export const generateAccessTokenAndRefreshToken = async (id) => {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  };

  export const CreateUser = async (req, res) => {
    try {
      const { FullName, username, email, password } = req.body;

      if (
        [FullName, username, email, password].some(
          (fildes) => !fildes || fildes.trim() == "",
        )
      ) {
        return res.status(400).json({ message: "All filed are reqiured " });
      }

      const existedUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existedUser) {
        return res.status(409).json({ message: "User is existed already!!" });
      }
      const user = await User.create({
        FullName: FullName,
        username: username,
        email: email,
        password: password,
      });

      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken ",
      );

      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);
      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          message: "User rigister successfuly ",
          user: createdUser,
          accessToken,
          refreshToken,
        });
    } catch (error) {
      return res
        .status(400)
        .json({
          message: "Somthing went wrong",
          error: error.message,
          stack: error.stack,
        });
    }
  };

  export const loginUser = async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if ((!email && !username) || !password) {
        return res.status(400).json({
          message: "Email or username and password are required",
        });
      }

      const user = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (!user) {
        return res.status(404).json({ message: "User is not found " });
      }

      if (user.googleId) {
      return res.status(400).json({
          message: "This account uses Google login. Please continue with Google."
      });
  }

      const PasswordCheck = await user.isPassworCorrect(password);

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

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          message: "Login user successfuly ",
          user: logginUser,
          accessToken,
          refreshToken,
        });

      // return res.status(200).json({message : "User login successfuly " , user});
    } catch (error) {
      return res
        .status(401)
        .json({ message: `failed to login user :  ${error}` });
    }
  };

  export const LogoutUser = async (req, res) => {
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

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User Logout successfuly " });
    } catch (error) {
      return res
        .status(401)
        .json({ message: `failed to Logout user :  ${error}` });
    }
  };

  export const changeCurrentPassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!(oldPassword || newPassword)) {
        return res.status(401).json({ message: "All filed are required " });
      }

      const user = await User.findById(req.user._id);
      const checkPassword = await user.isPassworCorrect(oldPassword);
      console.log(checkPassword);
      if (!checkPassword) {
        return res.status(400).json({ message: "Password is wrong !!" });
      }
      console.log(newPassword);
      user.password = newPassword;

      await user.save({ validateBeforeSave: false });

      return res.status(200).json({ messsage: "Password is updated Succfully " });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
        stack: error.stack,
      });
    }
  };

  export const getuserData = async (req, res) => {
    return res
      .status(200)
      .json({ message: "Fetch user data successfully", user: req.user });
  };

  export const updateUserInfo = async (req, res) => {
    try {
      const { FullName, email } = req.body;

      if (!FullName && !email) {
        return res.status(401).json({ message: "Enter data for update " });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            FullName,
            email,
          },
        },
        {
          new: true,
        },
      ).select("-password");

      res.status(200).json({ message: "user detail is update" }, user);
    } catch (error) {
      res.status(400).json({ message: "somthing went wrong" }, error);
    }
  };

  export const refreshAccessToken = async (req, res) => {
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

      const options = {
        httpOnly: true,
        secure: true,
      };

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "Refresh Token is updated" }, accessToken, refreshToken);
    } catch (error) {
      return res.status(401).json({ message: "Invalid access Token" });
    }
  };


  const googleClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  export const googleLogin = async (req, res) => {
    try {
      const { code } = req.body;

      const { tokens } = await googleClient.getToken(code);

      googleClient.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: googleClient,
        version: "v2",
      });

      const response = await oauth2.userinfo.get();

      const { email, name, picture , id } = response.data;

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          FullName: name,
          username: email.split("@")[0],
          email,
          picture,
          googleId: id,
          isVerified: true,
        });
      }

      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken",
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          success: true,
          user: loggedInUser,
          refreshToken,
        });

    } catch (error) {
      console.log("Google Login Error:", error);

      return res.status(500).json({
        success: false,
        message: "Google login failed",
        error: error.message,
      });
    }
  };
