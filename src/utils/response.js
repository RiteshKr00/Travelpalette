const successResponse = (data, message = "Success", status = 200) => {
  return {
    status: "success",
    message: message,
    data: data,
    statusCode: status, // Include the status code
  };
};

const errorResponse = (message = "An error occurred", status = 500) => {
  return {
    status: "error",
    message: message,
    statusCode: status, // Include the status code
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
