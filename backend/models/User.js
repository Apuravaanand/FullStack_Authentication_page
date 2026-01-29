import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: { type: String, required: true, select: false },

    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },

    resetOtp: { type: String, select: false },
    resetOtpExpiry: { type: Date, select: false },

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* Hash password */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* Password comparison */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* Generate OTP */
userSchema.methods.generateOtp = async function (type = "verify") {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  if (type === "verify") {
    this.otp = hashedOtp;
    this.otpExpiry = Date.now() + 10 * 60 * 1000;
  } else if (type === "reset") {
    this.resetOtp = hashedOtp;
    this.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
  }

  return otp; // send plain OTP in email
};

/* Clean response */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  delete obj.resetOtp;
  delete obj.resetOtpExpiry;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
