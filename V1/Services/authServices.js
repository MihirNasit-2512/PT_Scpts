const { USER_ROLE, STATUS } = require("../Helper/Constant");
const User = require("../Model/userSchema");
const jwt = require("jsonwebtoken");

exports.registerSevice = async (bData, logUser) => {
  try {
    var resData = [false, [], ""];
    const isUser = await User.findOne({ email: bData.email });
    if (isUser) {
      resData[2] = "User Already Exists.";
      return resData;
    }
    if (bData.role == USER_ROLE.CUSTOMER) {
      const isManager = await User.findOne({
        _id: bData.manager,
        role: USER_ROLE.ADMIN,
      });
      if (!isManager) {
        resData[2] = "Manager Does Not Exists.";
        return resData;
      }
    }
    if (isUser) {
      resData[2] = "User Already Exists.";
      return resData;
    }
    const newUser = await User.create(bData);
    if (newUser) {
      resData[0] = true;
      resData[1] = newUser.email;
      resData[2] = "Registration Successful.";
    }

    return resData;
  } catch (error) {
    console.log("error", error);
    return resData;
  }
};

exports.loginSevice = async (bData) => {
  try {
    var resData = [false, [], ""];
    const isUser = await User.findOne({ email: bData.email });
    if (!isUser) {
      resData[2] = "User Does Not Exists.";
      return resData;
    }
    const isValid = await isUser.isValidPassword(bData.password);
    if (isValid == false) {
      resData[2] = "Incorrect Password.";
      return resData;
    }
    const token = await jwt.sign(
      { email: isUser.email },
      process.env.JWT_SECRET
    );
    resData[0] = true;
    resData[1] = { email: isUser.email, token: token };
    resData[2] = "Login Successful.";
    return resData;
  } catch (error) {
    console.log("error", error);
    return resData;
  }
};

exports.getUserService = async (logUser) => {
  var resData = [false, [], ""];
  const isUser = await User.findOne({ email: logUser.email });
  if (!isUser) {
    resData[2] = "User Does Not Exists.";
    return resData;
  }
  var query = {
    Status: { $nin: STATUS.DELETED },
  };
  if (isUser.role == USER_ROLE.CUSTOMER) {
    query.role = USER_ROLE.CUSTOMER;
  }
  const userData = await User.find(query);
  resData[0] = true;
  resData[1] = userData;
  resData[2] = "";
  return resData;
};
