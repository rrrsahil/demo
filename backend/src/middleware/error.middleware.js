const globalErrorHandler = (
  err, // The error object thrown by the robot
  req,
  res,
  next, // Required so Express knows this is an Error Handler
) => {
  let error = err;
  if (typeof err === "string") {
    error = new Error(err);
  }

  // If the error doesn't have a status code (like a random DB crash), default to 500
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  let message = error.message || "Internal Server Error";
  const validationErrors = error.errors || error.data;

  // SCENARIO A: We are coding (Development)
  // We want to see EVERYTHING: The message, the code, and the "Stack Trace" (exactly which line failed).
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      status: status,
      message: message,
      stack: error.stack,
      ...(validationErrors?.length > 0 && { data: validationErrors }),
    });
  }
  // SCENARIO B: We are Live (Production)
  // We don't want to show hackers our code structure (stack trace).
  // We just say: "Something went wrong" or the specific simple message.
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "production\r"
  ) {
    if (statusCode === 500) {
      console.error("💥 SYSTEM ERROR 💥", error); // Still log it so YOU can see it in your server console
      message = "Something went wrong on our end. Please try again later.";
    }
    return res.status(statusCode).json({
      success: false,
      status: status,
      message: message,
      ...(validationErrors?.length > 0 && { errors: validationErrors }),
    });
  }
};

module.exports = { globalErrorHandler }
