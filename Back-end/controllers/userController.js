import bcrypt from "bcryptjs";
import User from "../models/User.js";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
  const { username, email, password, inviteCode } = req.body; 

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = inviteCode === "SPECIALADMINCODE" ? "admin" : "user";

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      role: user.role,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUsersId = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  const { userId } = req.params;
  console.log("User ID:", req.params.userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User blocked successfully", user });
  } catch (error) {
    console.error("Error while blocking user:", error);
    res.status(500).json({ message: error.message });
  }
};

export const unblockUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User unblocked successfully", user });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "Detection not found" });
    }
    res.status(200).json({ message: "Detection deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDetections:", error);
    res.status(500).json({ message: error.message });
  }
};
