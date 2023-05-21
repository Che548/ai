const User = require('../../models/User');
const Token = require('../../models/schema/tokenSchema');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { registerSchema } = require('../../strategies/validators');
const migrateDataToFirstUser = require('../../utils/migrateDataToFirstUser');

const isProduction = process.env.NODE_ENV === 'production';
const clientUrl = isProduction ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

/**
 * Logout user
 *
 * @param {Object} user 
 * @param {*} refreshToken 
 * @returns 
 */
const logoutUser = async (user, refreshToken) => {
  try {
    const userFound = await User.findById(user._id);
    const tokenIndex = userFound.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

    if (tokenIndex !== -1) {
      userFound.refreshToken.id(userFound.refreshToken[tokenIndex]._id).remove();
    }

    await userFound.save();

    return { status: 200, message: 'Logout successful' };
  } catch (err) {
    return { status: 500, message: err.message };
  }
}

/**
 * Register a new user
 *
 * @param {Object} user <email, password, name, username>
 * @returns 
 */
const registerUser = async (user) => {
  const { error } = registerSchema.validate(user);
  if (error) {
    console.info(
      'Route: register - Joi Validation Error',
      { name: 'Request params:', value: user },
      { name: 'Validation error:', value: error.details }
    );

    return { status: 422, message: error.details[0].message };
  }

  const { email, password, name, username } = user;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.info(
        'Register User - Email in use',
        { name: 'Request params:', value: user },
        { name: 'Existing user:', value: existingUser }
      );
      
      // Sleep for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: We should change the process to always email and be generic is signup works or fails (user enum)
      return { status: 500, message: 'Something went wrong' };
    }

    //determine if this is the first registered user (not counting anonymous_user)
    const isFirstRegisteredUser = (await User.countDocuments({})) === 0;

    const newUser = await new User({
      provider: 'local',
      email,
      password,
      username,
      name,
      avatar: null,
      role: isFirstRegisteredUser ? 'ADMIN' : 'USER'
    });

    // todo: implement refresh token

    // Perform synchronously to prevent a race condition
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    newUser.save();

    // Legacy: This should be removed in a future release
    if (isFirstRegisteredUser) {
      migrateDataToFirstUser(newUser);
    }

    return { status: 200, user: newUser };
  
  } catch (err) {
    return { status: 500, message: err?.message || 'Something went wrong' };
  }
};
 
/**
 * Request password reset
 *
 * @param {String} email 
 * @returns 
 */
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return new Error('Email does not exist');
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, 10);

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now()
  }).save();

  const link = `${clientUrl}/reset-password?token=${resetToken}&userId=${user._id}`;

  sendEmail(
    user.email,
    'Password Reset Request',
    {
      name: user.name,
      link: link
    },
    './template/requestResetPassword.handlebars'
  );
  return { link };
};

/**
 * Reset Password
 *
 * @param {*} userId 
 * @param {String} token 
 * @param {String} password 
 * @returns 
 */
const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    return new Error('Invalid or expired password reset token');
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    return new Error('Invalid or expired password reset token');
  }

  const hash = await bcrypt.hash(password, 10);

  await User.updateOne({ _id: userId }, { $set: { password: hash } }, { new: true });

  const user = await User.findById({ _id: userId });

  sendEmail(
    user.email,
    'Password Reset Successfully',
    {
      name: user.name
    },
    './template/resetPassword.handlebars'
  );

  await passwordResetToken.deleteOne();

  return { message: 'Password reset was successful' };
};

module.exports = {
  registerUser,
  logoutUser,
  requestPasswordReset,
  resetPassword
};
