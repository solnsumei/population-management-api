import bcrypt from 'bcrypt';
import User from '../models/User';
import { formattedUserResponse } from '../utils/helpers';


/**
 * Handle unauthorized login errors
 * 
 * @param {Object} ctx 
 */
const unauthorizedErrorHandler = (ctx) => {
  ctx.throw(401, 'Email and/or password is incorrect');
}

export default {
  async register(ctx) {
    const { email, password } = ctx.request.body;

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        email,
        password: passwordHash,
      });

      const userResponse = await formattedUserResponse(user);
      ctx.status = 201;
      ctx.body = userResponse;
    } catch (error) {
      if (error.code === 11000 && error.name === 'MongoError') {
        ctx.throw(409, 'User with this email already exist');
      }
      throw error;
    }
  },
  async login(ctx) {
    const { email, password } = ctx.request.body;

    try {
      const user = await User.findOne({ email }).exec();

      if (!user) {
        unauthorizedErrorHandler(ctx);
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        unauthorizedErrorHandler(ctx);
      }

      const userResponse = await formattedUserResponse(user);
      ctx.status = 200;
      ctx.body = userResponse;
    } catch (error) {
      throw error;
    }
  },
}
