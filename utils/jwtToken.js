// Create and send token and save it in the cookie
const sendToken = (user, statusCode, res) => {
  
  // create jwt token
  const token = user.getJwtToken();

  //Options for cookie expires

  // const options = {
  //   expires: new Date(
  //     Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  //   // maxAge:Date.now() + (process.env.COOKIE_EXPIRES_TIME + 12) * 24 * 60 * 60 * 1000
  // };

  res.status(statusCode).cookie("token", token).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
