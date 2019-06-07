import dotenv from 'dotenv';
import jwt from 'koa-jwt';
import jsonwebtoken from 'jsonwebtoken';


dotenv.config();

const SECRET = process.env.SECRET || 'jkksjsjskjsks';

const jwtInstance = () => jwt({ secret: SECRET });

const JWTErrorHandler = (ctx, next) => {
  return next()
    .catch((err) => {
      if (401 === err.status) {
        ctx.status = 401;
        ctx.body = {
          "message": "User not authorized"
        };
      } else {
        throw err;
      }
    })
};

const issueToken = payload => jsonwebtoken.sign(payload, SECRET);

export { jwtInstance, JWTErrorHandler, issueToken };
