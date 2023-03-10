const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { STATUS } = require("../Helper/Constant");

let userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  manager: {
    type: String,
  },
  Status: {
    type: Number,
    required: true,
    default: STATUS.ACTIVE,
  },
});

userSchema.set("timestamps", true);

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};
const UserSchema = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserSchema;
