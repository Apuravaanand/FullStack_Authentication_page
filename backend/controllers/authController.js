import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { sendEmail } from "../config/mailer.js";
import generateToken from "../utils/generateToken.js";

// REGISTER USER → Send OTP
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  const user = await User.create({
    name,
    email,
    password,
    otp,
    otpExpiry,
    isVerified: false,
  });

  await sendEmail(
    email,
    "Your OTP for Auth App",
    `Hello ${name}, your OTP is ${otp}. It expires in 10 minutes.`
  );

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    message: "OTP sent to email, please verify",
  });
});



export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  // 👇 MUST select otp & otpExpiry
  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User already verified");
  }

  if (!user.otp || !user.otpExpiry) {
    res.status(400);
    throw new Error("OTP not found. Please request again.");
  }

  if (user.otp !== otp) {
    res.status(400);
    throw new Error("Incorrect OTP");
  }

  if (Date.now() > user.otpExpiry) {
    res.status(400);
    throw new Error("OTP expired");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
    message: "Email verified successfully",
  });
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password required");
  }

  // 👇 MUST select password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error("Email not verified");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});


// GET CURRENT USER → Protected
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});