const { USER_ROLE, STATUS } = require("../Helper/Constant");
const { successResponse, errorResponse } = require("../Helper/response");
const User = require("../Model/userSchema");
const ObjectId = require("mongoose").Types.ObjectId;

//Create one API which will return data of the user along with his manager and all other users to whom he is assigned as a manager.
exports.getUsersWithManager = async (req, res) => {
  try {
    const logUser = req.user.email;
    const isUser = await User.findOne({ email: logUser });
    if (!isUser) {
      res.status(400).send(errorResponse({}, "User Does Not Exists."));
      return resData;
    }
    var userData = await User.aggregate([
      {
        $facet: {
          Team: [
            {
              $group: {
                _id: "$manager",
                Team: {
                  $addToSet: {
                    name: { $concat: ["$FirstName", " ", "$LastName"] },
                    email: "$email",
                    profile: "$profile",
                  },
                },
              },
            },
            {
              $match: {
                _id: isUser._id.toString(),
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
          Manager: [
            {
              $match: {
                _id: ObjectId(isUser.manager),
              },
            },
            {
              $project: {
                _id: 0,
                name: { $concat: ["$FirstName", " ", "$LastName"] },
                email: 1,
                profile: 1,
              },
            },
          ],
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$$ROOT", { Team: "$Team.Team" }] },
        },
      },
    ]);

    let resDataObj = {
      FirstName: isUser.FirstName,
      LastName: isUser.LastName,
      email: isUser.email,
      profile: isUser.profile,
      manager: userData[0].Manager[0],
      Team: userData[0].Team[0],
    };
    res.status(200).send(successResponse(resDataObj, ""));
  } catch (error) {
    throw error;
  }
};

//Create CRUD operations for the Users which is only available for ADMIN type of user.
exports.addUser = async (req, res) => {
  try {
    var bdata = req.body;
    const isLoginUser = await User.findOne({ email: req.user.email });
    if (isLoginUser.role == USER_ROLE.CUSTOMER) {
      res.status(400).send(errorResponse({}, "Unauthorized."));
      return false;
    }
    const isUser = await User.findOne({ email: bdata.email });
    if (isUser) {
      res.status(400).send(errorResponse({}, "User Already Exists."));
      return false;
    }
    const newUser = await User.create(bdata);
    res
      .status(200)
      .send(successResponse({ email: newUser.email }, "User Created."));
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (req, res) => {
  try {
    const bdata = req.body;
    const isLoginUser = await User.findOne({
      email: req.user.email,
      Status: { $nin: STATUS.DELETED },
    });
    if (!isLoginUser) {
      res.status(400).send(errorResponse({}, "User Does Not Exists."));
      return false;
    }
    if (isLoginUser.role == USER_ROLE.CUSTOMER) {
      res.status(400).send(errorResponse({}, "Unauthorized."));
      return false;
    }
    const isUser = await User.findOne({
      _id: req.params.id,
      Status: { $nin: STATUS.DELETED },
    });

    if (!isUser) {
      res.status(400).send(errorResponse({}, "User Does Not Exists."));
      return false;
    }
    let updObj = {};
    bdata.FirstName && (updObj.FirstName = bdata.FirstName);
    bdata.LastName && (updObj.LastName = bdata.LastName);
    bdata.email && (updObj.email = bdata.email);
    bdata.profile && (updObj.profile = bdata.profile);
    bdata.role && (updObj.role = bdata.role);
    bdata.manager && (updObj.manager = bdata.manager);
    bdata.Status && (updObj.Status = bdata.Status);
    updObj.updatedAt = new Date();
    const userData = await User.updateOne(
      { _id: isUser._id },
      { $set: updObj }
    );
    if (userData.modifiedCount > 0) {
      res.status(200).send(successResponse({}, "User Updated."));
    } else {
      res.status(400).send(errorResponse({}, "User Not Updated."));
    }
  } catch (error) {
    throw error;
  }
};

exports.getUsers = async (req, res) => {
  try {
    const isLoginUser = await User.findOne({
      email: req.user.email,
      Status: { $nin: STATUS.DELETED },
    });
    if (!isLoginUser) {
      res.status(400).send(errorResponse({}, "User Does Not Exists."));
      return false;
    }
    if (isLoginUser.role == USER_ROLE.CUSTOMER) {
      res.status(400).send(errorResponse({}, "Unauthorized."));
      return false;
    }
    const userData = await User.find({
      Status: { $nin: STATUS.DELETED },
    });
    res.status(200).send(successResponse(userData, ""));
  } catch (error) {
    throw error;
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const isLoginUser = await User.findOne({ email: req.user.email });
    if (!isLoginUser) {
      res.status(400).send(errorResponse({}, "User Does Not Exists."));
      return false;
    }
    if (isLoginUser.role == USER_ROLE.CUSTOMER) {
      res.status(400).send(errorResponse({}, "Unauthorized."));
      return false;
    }
    const isUser = await User.findOne({
      _id: req.params.id,
      Status: { $nin: STATUS.DELETED },
    });

    if (!isUser) {
      res.status(400).send(errorResponse({}, "User Does Not Exists."));
      return false;
    }
    const userData = await User.updateOne(
      { _id: isUser._id },
      { $set: { Status: STATUS.DELETED, updatedAt: new Date() } }
    );
    if (userData.modifiedCount > 0) {
      res.status(200).send(successResponse({}, "User Deleted."));
    } else {
      res.status(400).send(errorResponse({}, "User Not Deleted."));
    }
  } catch (error) {
    throw error;
  }
};
