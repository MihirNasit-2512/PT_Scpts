const { USER_ROLE } = require("../Helper/Constant");
const { errorResponse, successResponse } = require("../Helper/response");
const User = require("../Model/userSchema");
const {
  registerSevice,
  loginSevice,
  getUserService,
} = require("../Services/authServices");

//User Registration & Sign up api

exports.register = async (req, res) => {
  var bData = req.body;

  const resData = await registerSevice(bData);
  if (resData[0] == false) {
    res.status(400).send(errorResponse({}, resData[2]));
    return false;
  }
  res.status(200).send(successResponse({ email: resData[1] }, resData[2]));
};

exports.login = async (req, res) => {
  var bData = req.body;
  const resData = await loginSevice(bData);
  if (resData[0] == false) {
    res.status(400).send(errorResponse({}, resData[2]));
    return false;
  }
  res.status(200).send(successResponse(resData[1], resData[2]));
};

//Create api in which if ADMIN user's token is passed it should return all the admins and users, While if Customer user's token is passed it should return only all customer users.
exports.getUserByToken = async (req, res) => {
  var userData = req.user;
  const resData = await getUserService(userData);
  if (resData[0] == false) {
    res.status(400).send(errorResponse({}, resData[2]));
    return false;
  }
  res.status(200).send(successResponse(resData[1], resData[2]));
};
