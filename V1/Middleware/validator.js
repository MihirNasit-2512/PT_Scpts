const { USER_ROLE } = require("../Helper/Constant");

exports.validateRegister = (req, res, next) => {
  var bData = req.body;
  if (!bData.FirstName) {
    res.status(400).send(errorResponse({}, "Enter First Name."));
    return false;
  }
  if (!bData.LastName) {
    res.status(400).send(errorResponse({}, "Enter Last Name."));
    return false;
  }
  if (!bData.email) {
    res.status(400).send(errorResponse({}, "Enter Email."));
    return false;
  }
  if (!bData.password) {
    res.status(400).send(errorResponse({}, "Enter Password."));
    return false;
  }
  if (!bData.role) {
    res.status(400).send(errorResponse({}, "Select Role."));
    return false;
  }
  if (bData.role == USER_ROLE.CUSTOMER && !bData.manager) {
    res.status(400).send(errorResponse({}, "Select Manager."));
    return false;
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  var bData = req.body;

  if (!bData.email) {
    res.status(400).send(errorResponse({}, "Enter Email."));
    return false;
  }
  if (!bData.password) {
    res.status(400).send(errorResponse({}, "Enter Password."));
    return false;
  }
  next();
};
