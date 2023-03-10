exports.errorResponse = (
  data = {},
  message = "",
  extraData,
  success = false
) => {
  if (message === undefined) {
    message = "";
  }

  const response = {
    message,
    extraData,
    success,
  };

  if (typeof data == "string") {
    message = data;
  } else if (typeof data == "object") {
    message = data.message || data[Object.keys(data)[0]] || data;
  }

  return response;
};

exports.successResponse = (
  data = {},
  message = "",
  extraData,
  success = true
) => {
  if (data && typeof data != "object" && !data.length) {
    return this.errorResponse({}, "Nothing To Show");
  }

  if (message === undefined) {
    message = "";
  }

  const response = {
    data,
    message,
    extraData,
    success,
  };

  return response;
};
